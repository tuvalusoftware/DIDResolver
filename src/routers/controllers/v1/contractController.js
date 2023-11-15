import axios from "axios";
import bs58 from "bs58";
import "dotenv/config";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import DocumentService from "../../../services/Document.service.js";
import ControllerService from "../../../services/Controller.service.js";
import { getAccountBySeedPhrase } from "../../../utils/lucid.js";
import { asyncWrapper } from "../../middlewares/async.js";
import credentialService from "../../../services/VerifiableCredential.service.js";

// * Constants
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import wrappedDocumentSchema from "../../../configs/schemas/wrappedDocument.schema.js";

axios.defaults.withCredentials = true;

/**
 * Controller for creating and getting contracts.
 * @typedef {Object} ContractController
 * @property {Function} createContract - Creates a new contract.
 * @property {Function} getContract - Gets an existing contract by DID.
 */
export default {
    createContract: asyncWrapper(async (req, res, next) => {
        const { wrappedDoc, metadata } = schemaValidator(
            requestSchema.createContract,
            req.body
        );
        const accessToken =
            env.NODE_ENV === "test"
                ? "mock-access-token"
                : await AuthenticationService().authenticationProgress();
        const companyName = env.COMPANY_NAME;
        const { fileName } = DocumentService(
            accessToken
        ).generateFileNameForDocument(
            wrappedDoc,
            WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT
        );
        const did = generateDid(companyName, fileName);
        const isExistedResponse = await ControllerService(
            accessToken
        ).isExisted({
            companyName,
            fileName,
        });
        if (isExistedResponse.data?.isExisted) {
            const getDocumentResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did,
            });
            const { wrappedDoc } = getDocumentResponse?.data;
            return {
                isExisted: true,
                wrappedDocument: wrappedDoc,
            };
        }
        const { dataForm } = await DocumentService(
            accessToken
        ).createWrappedDocumentData(
            fileName,
            wrappedDoc,
            WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT
        );
        schemaValidator(wrappedDocumentSchema.dataForIssueDocument, dataForm);
        const { wrappedDocument } = await DocumentService(
            accessToken
        ).issueBySignByAdmin(dataForm, companyName);
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
        return res.status(200).json({
            did,
        });
    }),
    getContract: asyncWrapper(async (req, res, next) => {
        const { did } = schemaValidator(requestSchema.did, req.params);
        const accessToken =
            env.NODE_ENV === "test"
                ? "mock-access-token"
                : await AuthenticationService().authenticationProgress();
        const docContentResponse = await ControllerService(
            accessToken
        ).getDocumentContent({
            did: did,
        });
        const { targetHash } = docContentResponse?.data?.wrappedDoc?.signature;
        return res.status(200).json({
            hash: targetHash,
            did,
        });
    }),
    signContract: asyncWrapper(async (req, res, next) => {
        const { contract, claimant, role } = schemaValidator(
            requestSchema.signContractWithClaimant,
            req.body
        );
        const { certificateDid, seedPhrase, userDid } = claimant;
        const companyName = env.COMPANY_NAME;
        // const accessToken =
        //     env.NODE_ENV === "test"
        //         ? "mock-access-token"
        //         : await AuthenticationService().authenticationProgress();
        // const contractContentResponse = await ControllerService(
        //     accessToken
        // ).getDocumentContent({
        //     did: contract,
        // });
        // const { mintingConfig } = contractContentResponse?.data?.wrappedDoc;
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
            await credentialService.createContractVerifiableCredential({
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
                credential: credentialHash,
                verifiedCredential,
                companyName,
                originDid: contract,
            },
            type: REQUEST_TYPE.MINTING_TYPE.signContract,
            status: "pending",
        });
        // await CardanoService(accessToken).storeCredentialsWithPolicyId({
        //     credentials: [credentialHash],
        //     mintingConfig,
        //     id: request._id,
        // });
        return res.status(200).json({
            did: credentialDid,
        });
    }),
    updateContract: asyncWrapper(async (req, res, next) => {
        const { did, metadata } = schemaValidator(
            requestSchema.updateContract,
            req.body
        );
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
        return res.status(200).json({
            updated: true,
        });
    }),
    verifyContract: asyncWrapper(async (req, res, next) => {
        const { seedPhrase, contractDid } = schemaValidator(
            requestSchema.verifyContract,
            req.body
        );
    }),
};
