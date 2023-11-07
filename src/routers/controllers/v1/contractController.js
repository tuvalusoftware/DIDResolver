// * Utilities
import axios from "axios";
import bs58 from "bs58";
import "dotenv/config";
import {
    getCurrentDateTime,
    getPublicKeyFromAddress,
    validateDID,
} from "../../../utils/index.js";
import { createDocumentTaskQueue } from "../../../utils/document.js";
import { getAccountBySeedPhrase } from "../../../utils/lucid.js";
import { createContractVerifiableCredential } from "../../../utils/credential.js";
import logger from "../../../../logger.js";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import { handleServerError } from "../../../configs/errors/errorHandler.js";
import ControllerService from "../../../services/Controller.service.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";

// * Constants
import { ERRORS } from "../../../configs/errors/error.constants.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import { env } from "../../../configs/constants.js";

axios.defaults.withCredentials = true;

/**
 * Controller for creating and getting contracts.
 * @typedef {Object} ContractController
 * @property {Function} createContract - Creates a new contract.
 * @property {Function} getContract - Gets an existing contract by DID.
 */
export default {
    createContract: async (req, res, next) => {
        try {
            const { wrappedDoc, metadata } = schemaValidator(
                requestSchema.createContract,
                req.body
            );
            const contractFileName = `LoanContract_${
                wrappedDoc._id || wrappedDoc.id
            }`;
            const companyName = env.COMPANY_NAME;
            logger.apiInfo(req, res, `Pdf file name: ${contractFileName}`);
            const accessToken =
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const isExistedResponse = await ControllerService(
                accessToken
            ).isExisted({
                companyName: companyName,
                fileName: contractFileName,
            });
            const contractDid = generateDid(companyName, contractFileName);
            if (isExistedResponse?.data?.isExisted) {
                logger.apiInfo(
                    req,
                    res,
                    `Document ${contractFileName} existed`
                );
                const getDocumentResponse = await ControllerService(
                    accessToken
                ).getDocumentContent({
                    did: contractDid,
                });
                const wrappedDocument = getDocumentResponse?.data?.wrappedDoc;
                return res.status(200).json(wrappedDocument);
            }
            const contractForm = {
                fileName: contractFileName,
                name: `Loan Contract`,
                title: `Land-Certificate-${wrappedDoc?._id}`,
                dateIssue: getCurrentDateTime(),
            };
            const { currentWallet, lucidClient } = await getAccountBySeedPhrase(
                {
                    seedPhrase: env.ADMIN_SEED_PHRASE,
                }
            );
            const { wrappedDocument } = await createDocumentTaskQueue({
                seedPhrase: env.ADMIN_SEED_PHRASE,
                documents: [contractForm],
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                access_token: accessToken,
                client: lucidClient,
                currentWallet: currentWallet,
                companyName: companyName,
            });
            const request = await RequestRepo.createRequest({
                data: {
                    wrappedDocument,
                    metadata,
                },
                type: REQUEST_TYPE.MINTING_TYPE.createContract,
                status: "pending",
            });
            await CardanoService(accessToken).storeToken({
                hash: wrappedDocument?.signature?.targetHash,
                id: request._id,
                type: "document",
            });
            logger.apiInfo(req, res, `Document ${contractFileName} created!`);
            return res.status(200).json({
                did: contractDid,
            });
        } catch (error) {
            next(handleServerError(error));
        }
    },
    getContract: async (req, res, next) => {
        try {
            const { did } = req.params;
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const docContentResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did: did,
            });
            const hash =
                docContentResponse?.data?.wrappedDoc?.signature?.targetHash;
            return res.status(200).json({
                hash: hash,
                did: did,
            });
        } catch (error) {
            next(handleServerError(error));
        }
    },
    signContract: async (req, res, next) => {
        try {
            const { contract, claimant, role } = schemaValidator(
                requestSchema.signContractWithClaimant,
                req.body
            );
            logger.apiInfo(req, res, `Pass validation!`);
            const { certificateDid, seedPhrase, userDid } = claimant;
            const { valid: validCertificateDid } = validateDID(contract);
            const companyName = env.COMPANY_NAME;
            if (!validCertificateDid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const contractContentResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did: contract,
            });
            const contractMintingConfig =
                contractContentResponse?.data?.wrappedDoc?.mintingConfig;
            if (!contractMintingConfig) {
                return next({
                    ...ERRORS.CANNOT_GET_DOCUMENT_INFORMATION,
                    detail: "Missing minting config!",
                });
            }
            const { currentWallet } = await getAccountBySeedPhrase({
                seedPhrase,
            });
            const userPrivateKey = bs58.encode(
                currentWallet?.paymentKey.as_bytes()
            );
            const userPublicKey = bs58.encode(
                currentWallet?.paymentKeyPub.as_bytes()
            );
            const { verifiableCredential, credentialHash } =
                await createContractVerifiableCredential({
                    subject: {
                        userDid,
                        contractDid: contract,
                        certificateDid,
                        role,
                    },
                    issuerKey: contract,
                    privateKey: userPrivateKey,
                    publicKey: userPublicKey,
                });
            const verifiedCredential = {
                ...verifiableCredential,
            };
            const credentialDid = generateDid(companyName, credentialHash);
            const request = await RequestRepo.createRequest({
                data: {
                    mintingConfig: contractMintingConfig,
                    credential: credentialHash,
                    verifiedCredential,
                    companyName,
                },
                type: REQUEST_TYPE.MINTING_TYPE.createClaimantCredential,
                status: "pending",
            });
            await CardanoService(accessToken).storeCredentialsWithPolicyId({
                credentials: [credentialHash],
                mintingConfig: contractMintingConfig,
                id: request?._id,
            });
            logger.apiInfo(req, res, "Successfully store credential!");
            return res.status(200).json({
                did: credentialDid,
            });
        } catch (error) {
            next(handleServerError(error));
        }
    },
    updateContract: async (req, res, next) => {
        try {
            const { did, metadata } = schemaValidator(
                requestSchema.updateContract,
                req.body
            );
            const didValidation = validateDID(did);
            if (!didValidation.valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const didDocumentResponse = await ControllerService(
                accessToken
            ).getDocumentDid({
                did,
            });
            const originDidDocument = didDocumentResponse?.data?.didDoc;
            await ControllerService(accessToken).updateDocumentDid({
                did,
                didDoc: {
                    ...originDidDocument,
                    meta_data: metadata,
                },
            });
            logger.apiInfo(req, res, "Successfully update contract!");
            return res.status(200).json({
                updated: true,
            });
        } catch (error) {
            next(handleServerError(error));
        }
    },
    verifyContract: async (req, res, next) => {
        try {
            const { seedPhrase, contractDid } = schemaValidator(
                requestSchema.verifyContract,
                req.body
            );
        } catch (error) {
            next(handleServerError(error));
        }
    },
};
