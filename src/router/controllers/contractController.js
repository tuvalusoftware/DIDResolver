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
    TaskQueueHelper,
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
    verifyContract: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Verify Contract!");
            const { seedPhrase, contractDid } = req.body;
            const undefinedVar = checkUndefinedVar({
                seedPhrase,
                contractDid,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
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
    getClaimantContract: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Get Claimant Contract!");
            const dids = [
                "did:fuixlabs:commonlands:PlotCertification-650152ce975b3ac94f4b4f45",
                "did:fuixlabs:commonlands:PlotCertification-65016830975b3ac94f4bf11d",
                "did:fuixlabs:commonlands:PlotCertification-650173c5975b3ac94f4cca07",
                "did:fuixlabs:commonlands:PlotCertification-650175b4975b3ac94f4cfcd1",
                "did:fuixlabs:commonlands:PlotCertification-65017c56975b3ac94f4db6cf",
                "did:fuixlabs:commonlands:PlotCertification-65017c7a975b3ac94f4dba00",
                "did:fuixlabs:commonlands:PlotCertification-65017cfb975b3ac94f4dc04b",
                "did:fuixlabs:commonlands:PlotCertification-65017e0b975b3ac94f4de2e0",
                "did:fuixlabs:commonlands:PlotCertification-65017e84975b3ac94f4ded75",
                "did:fuixlabs:commonlands:PlotCertification-65017ea4975b3ac94f4df430",
                "did:fuixlabs:commonlands:PlotCertification-65018035975b3ac94f4e19d7",
                "did:fuixlabs:commonlands:PlotCertification-650180c8975b3ac94f4e3abf",
                "did:fuixlabs:commonlands:PlotCertification-650181e0975b3ac94f4e6edc",
                "did:fuixlabs:commonlands:PlotCertification-6501823f975b3ac94f4e7633",
                "did:fuixlabs:commonlands:PlotCertification-6501843e975b3ac94f4ec2ca",
                "did:fuixlabs:commonlands:PlotCertification-650184fe975b3ac94f4ec6db",
                "did:fuixlabs:commonlands:PlotCertification-65018527975b3ac94f4ec95e",
                "did:fuixlabs:commonlands:PlotCertification-65018634975b3ac94f4ef1e7",
                "did:fuixlabs:commonlands:PlotCertification-650187e0975b3ac94f4f1cc2",
                "did:fuixlabs:commonlands:PlotCertification-650187e6975b3ac94f4f1ce1",
                "did:fuixlabs:commonlands:PlotCertification-65018803975b3ac94f4f1f9d",
                "did:fuixlabs:commonlands:PlotCertification-65018b4a975b3ac94f4f6c9d",
                "did:fuixlabs:commonlands:PlotCertification-65018b5a975b3ac94f4f6e24",
                "did:fuixlabs:commonlands:PlotCertification-65018ba0975b3ac94f4f7bc9",
                "did:fuixlabs:commonlands:PlotCertification-65018d5b975b3ac94f4fb9c6",
                "did:fuixlabs:commonlands:PlotCertification-65018f2c975b3ac94f50138c",
                "did:fuixlabs:commonlands:PlotCertification-65019006975b3ac94f5029a1",
                "did:fuixlabs:commonlands:PlotCertification-65019008975b3ac94f502b4a",
                "did:fuixlabs:commonlands:PlotCertification-650191ae975b3ac94f505fa5",
                "did:fuixlabs:commonlands:PlotCertification-6501932c975b3ac94f508f29",
                "did:fuixlabs:commonlands:PlotCertification-65019389975b3ac94f5091f6",
                "did:fuixlabs:commonlands:PlotCertification-650195d5975b3ac94f50b36b",
            ];
            const getPromise = dids.map(async (did) => {
                const response = await TaskQueueHelper.findRequestsRelatedToDid(
                    {
                        did,
                    }
                );
                return response?.data?.request?.data?.claimants;
            });
            const values = await Promise.all(getPromise);
            return res.status(200).json(values);
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
