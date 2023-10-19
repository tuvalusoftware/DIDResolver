// * Utilities
import axios from "axios";
import bs58 from "bs58";
import "dotenv/config";
import {
    checkUndefinedVar,
    getCurrentDateTime,
    getPublicKeyFromAddress,
    validateJSONSchema,
    validateDID,
} from "../../utils/index.js";
import { createDocumentTaskQueue } from "../../utils/document.js";
import {
    AuthHelper,
    ControllerHelper,
    CardanoHelper,
} from "../../helpers/index.js";
import { getAccountBySeedPhrase } from "../../utils/lucid.js";
import { createContractVerifiableCredential } from "../../utils/credential.js";
import logger from "../../../logger.js";

// * Constants
import { ERRORS } from "../../config/errors/error.constants.js";
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import contractSchema from "../../config/schemas/contract.schema.js";

axios.defaults.withCredentials = true;

export default {
    /**
     * Creates a new contract
     * @memberof contractController
     * @async
     * @function createContract
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     * @returns {Object} - The response object containing the DID of the created contract
     */
    createContract: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Create Contract!");
            const { wrappedDoc, metadata } = req.body;
            const undefinedVar = checkUndefinedVar({
                wrappedDoc,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const validateSchema = validateJSONSchema(
                contractSchema.CREATE_CONTRACT_REQUEST_BODY,
                wrappedDoc
            );
            if (!validateSchema.valid) {
                return next(ERRORS.INVALID_INPUT);
            }
            const contractFileName = `LoanContract_${
                wrappedDoc._id || wrappedDoc.id
            }`;
            const companyName = process.env.COMPANY_NAME;
            logger.apiInfo(req, res, `Pdf file name: ${contractFileName}`);
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const isExistedResponse = await ControllerHelper.isExisted({
                accessToken: accessToken,
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
                const getDocumentResponse =
                    await ControllerHelper.getDocumentContent({
                        accessToken,
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
                    seedPhrase: process.env.ADMIN_SEED_PHRASE,
                }
            );
            const { wrappedDocument } = await createDocumentTaskQueue({
                seedPhrase: process.env.ADMIN_SEED_PHRASE,
                documents: [contractForm],
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                access_token: accessToken,
                client: lucidClient,
                currentWallet: currentWallet,
                companyName: companyName,
            });
            const mintingResponse = await CardanoHelper.storeToken({
                hash: wrappedDocument?.signature?.targetHash,
                accessToken,
            });
            const mintingConfig = mintingResponse?.data?.data;
            const willWrappedDocument = {
                ...wrappedDocument,
                mintingConfig,
            };
            const storeWrappedDocumentResponse =
                await ControllerHelper.storeDocument({
                    accessToken,
                    companyName,
                    fileName: contractFileName,
                    wrappedDocument: willWrappedDocument,
                });
            if (metadata) {
                const didDocumentResponse =
                    await ControllerHelper.getDocumentDid({
                        did: contractDid,
                        accessToken,
                    });
                const originDidDocument = didDocumentResponse?.data?.didDoc;
                const updateDidDocumentResponse =
                    await ControllerHelper.updateDocumentDid({
                        accessToken,
                        did: contractDid,
                        didDoc: {
                            ...originDidDocument,
                            meta_data: metadata,
                        },
                    });
            }
            logger.apiInfo(req, res, `Document ${contractFileName} created!`);
            return res.status(200).json({
                did: contractDid,
            });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    /**
     * Retrieves a contract by its DID
     * @memberof contractController
     * @async
     * @function getContract
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     * @returns {Object} - The response object containing the hash and DID of the retrieved contract
     */
    getContract: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Get Contract!");
            const { did } = req.params;
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const docContentResponse =
                await ControllerHelper.getDocumentContent({
                    did: did,
                    accessToken: accessToken,
                });
            const hash =
                docContentResponse?.data?.wrappedDoc?.signature?.targetHash;
            return res.status(200).json({
                hash: hash,
                did: did,
            });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    signContract: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Sign Contract!");
            const { contract, claimant, role } = req.body;
            const undefinedVar = checkUndefinedVar({
                contract,
                role,
                claimant,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const validateSchema = validateJSONSchema(
                contractSchema.SIGN_CONTRACT_REQUEST_BODY,
                req.body
            );
            if (!validateSchema.valid) {
                return next(ERRORS.INVALID_INPUT);
            }
            logger.apiInfo(req, res, `Pass validation!`);
            const { certificateDid, seedPhrase, userDid } = claimant;
            const { valid: validCertificateDid } = validateDID(contract);
            const companyName = process.env.COMPANY_NAME;
            if (!validCertificateDid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const contractContentResponse =
                await ControllerHelper.getDocumentContent({
                    accessToken,
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
            const credentialResponse = await CardanoHelper.storeCredentials({
                mintingConfig: contractMintingConfig,
                credentialHash: credentialHash,
                accessToken,
            });
            const credentialDid = generateDid(companyName, credentialHash);
            verifiedCredential.credentialSubject = {
                ...verifiedCredential.credentialSubject,
                id: credentialDid,
            };
            logger.apiInfo(req, res, JSON.stringify(verifiedCredential));
            const storeCredentialStatus =
                await ControllerHelper.storeCredentials({
                    payload: {
                        ...verifiedCredential,
                        id: credentialDid,
                    },
                    accessToken,
                });
            logger.apiInfo(req, res, "Successfully store credential!");
            return res.status(200).json({
                did: credentialDid,
            });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    updateContract: async (req, res, next) => {
        try {
            const { did, metadata } = req.body;
            const undefinedVar = checkUndefinedVar({
                did,
                metadata,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const didValidation = validateDID(did);
            if (!didValidation.valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const didDocumentResponse = await ControllerHelper.getDocumentDid({
                did,
                accessToken,
            });
            const originDidDocument = didDocumentResponse?.data?.didDoc;
            const updateDidDocumentResponse =
                await ControllerHelper.updateDocumentDid({
                    accessToken,
                    did: contractDid,
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
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
};
