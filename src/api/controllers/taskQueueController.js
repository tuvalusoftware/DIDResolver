import { REQUEST_TYPE } from "../../config/constants.js";
import { ERRORS } from "../../config/errors/error.constants.js";
import logger from "../../../logger.js";
import { checkUndefinedVar } from "../utils/index.js";
import {
    AuthHelper,
    TaskQueueHelper,
    ControllerHelper,
} from "../../helpers/index.js";
import "dotenv/config";
import { unsalt } from "../../fuixlabs-documentor/utils/data.js";
import {
    getDidDocumentByDid,
    getDocumentContentByDid,
    updateDocumentDid,
} from "../utils/controller.js";
import { createVerifiableCredential } from "../utils/credential.js";
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import { CardanoHelper } from "../../helpers/index.js";

export default {
    revokeDocument: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Request revoke document!");
            const { mintingConfig } = req.body;
            const undefinedVar = checkUndefinedVar({ mintingConfig });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const revokeResponse = await CardanoHelper.burnNft({
                mintingConfig,
                accessToken,
            });
            if (revokeResponse?.data?.code !== 0) {
                return next({
                    ...ERRORS?.REVOKE_DOCUMENT_FAILED,
                    detail: revokeResponse?.data,
                });
            }
            logger.apiInfo(req, res, `Revoke document successfully!`);
            return res.status(200).json({
                revoked: true,
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
    createDocument: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Request create document!");
            const { wrappedDocument, companyName, url, did } = req.body;
            const undefinedVar = checkUndefinedVar({
                wrappedDocument,
                companyName,
                url,
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const mintingResponse = await CardanoHelper.storeToken({
                hash: wrappedDocument?.signature?.targetHash,
                accessToken,
            });
            if (mintingResponse?.data?.code !== 0) {
                throw {
                    ...ERRORS.CANNOT_MINT_NFT,
                    detail: mintingResponse?.data,
                };
            }
            const mintingConfig = mintingResponse?.data?.data;
            logger.apiInfo(
                req,
                res,
                `Minting config: ${JSON.stringify(mintingConfig)}`
            );
            const willWrappedDocument = {
                ...wrappedDocument,
                mintingConfig,
            };
            const fileName = unsalt(willWrappedDocument?.data?.fileName);
            logger.apiInfo(req, res, `File name: ${fileName}`);
            const storeWrappedDocumentStatus =
                await ControllerHelper.storeDocument({
                    accessToken,
                    companyName,
                    fileName,
                    wrappedDocument: willWrappedDocument,
                });
            if (storeWrappedDocumentStatus?.data?.error_code) {
                return next(
                    storeWrappedDocumentStatus?.data ||
                        ERRORS.CANNOT_STORE_DOCUMENT
                );
            }
            logger.apiInfo(
                req,
                res,
                `Wrapped document ${JSON.stringify(willWrappedDocument)}`
            );
            const didResponse = await getDidDocumentByDid({
                did: did,
                accessToken: accessToken,
            });
            if (!didResponse?.didDoc) {
                return next(ERRORS.CANNOT_GET_DID_DOCUMENT);
            }
            const updateDidDoc = {
                ...didResponse?.didDoc,
                pdfUrl: url,
            };
            const updateDidDocResponse = await updateDocumentDid({
                did: did,
                accessToken: accessToken,
                didDoc: updateDidDoc,
            });
            if (updateDidDocResponse?.error_code) {
                return next(ERRORS.ERROR_PUSH_URL_TO_DID_DOCUMENT);
            }
            return res.status(200).json({ url: url, did: did });
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
    createPlotDocument: async (req, res, next) => {
        try {
            logger.apiInfo(
                req,
                res,
                "Request API: Request create plot document!"
            );
            const { wrappedDocument, plot, did, companyName } = req.body;
            const undefinedVar = checkUndefinedVar({
                wrappedDocument,
                plot,
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            logger.apiInfo(
                req,
                res,
                `Wrapped document ${JSON.stringify(wrappedDocument)}`
            );
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const mintingResponse = await CardanoHelper.storeToken({
                hash: wrappedDocument?.signature?.targetHash,
                accessToken,
            });
            if (mintingResponse?.data?.code !== 0) {
                throw {
                    ...ERRORS.CANNOT_MINT_NFT,
                    detail: mintingResponse?.data,
                };
            }
            const mintingConfig = mintingResponse?.data?.data;
            const willWrappedDocument = {
                ...wrappedDocument,
                mintingConfig,
            };
            const fileName = unsalt(willWrappedDocument?.data?.fileName);
            logger.apiInfo(req, res, `File name: ${fileName}`);
            const storeWrappedDocumentStatus =
                await ControllerHelper.storeDocument({
                    accessToken,
                    companyName,
                    fileName,
                    wrappedDocument: willWrappedDocument,
                });

            if (storeWrappedDocumentStatus?.data?.error_code) {
                return next(
                    storeWrappedDocumentStatus?.data ||
                        ERRORS.CANNOT_STORE_DOCUMENT
                );
            }
            const claimants = plot?.claimants;
            let claimantData = [];
            if (claimants) {
                const promises = claimants?.map(async (claimant) => {
                    const { verifiableCredential, credentialHash } =
                        await createVerifiableCredential({
                            subject: {
                                claims: {
                                    plot: plot?._id,
                                    ...claimant,
                                },
                            },
                            issuerKey: did,
                        });
                    const taskQueueResponse =
                        await TaskQueueHelper.sendMintingRequest({
                            data: {
                                mintingConfig,
                                credential: credentialHash,
                                verifiedCredential: verifiableCredential,
                            },
                            type: REQUEST_TYPE.MINT_CREDENTIAL,
                            did: generateDid(companyName, credentialHash),
                        });
                    return taskQueueResponse?.data?.data?.did;
                });
                claimantData = await Promise.all(promises).catch((error) => {
                    return next(ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT);
                });
            }
            return res.status(200).json({
                claimants: claimantData,
                plot: did,
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
    createClaimantCredential: async (req, res, next) => {
        try {
            logger.apiInfo(
                req,
                res,
                "Request API: Request create claimant credential!"
            );
            const {
                mintingConfig,
                credentialHash,
                verifiedCredential,
                companyName,
            } = req.body;
            const undefinedVar = checkUndefinedVar({
                mintingConfig,
                credentialHash,
                verifiedCredential,
                companyName,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const credentialResponse = await CardanoHelper.storeCredentials({
                mintingConfig,
                credentialHash: credentialHash,
                accessToken,
            });
            if (credentialResponse?.data?.code !== 0) {
                return next({
                    ...ERRORS.CREDENTIAL_FAILED,
                    detail: credentialResponse?.data,
                });
            }
            verifiedCredential.credentialSubject = {
                claims: { ...verifiedCredential.credentialSubject.claims },
                id: generateDid(companyName, credentialHash),
            };
            logger.apiInfo(req, res, JSON.stringify(verifiedCredential))
            const storeCredentialStatus =
                await ControllerHelper.storeCredentials({
                    payload: {
                        ...verifiedCredential,
                        id: generateDid(companyName, credentialHash),
                    },
                    accessToken,
                });
            if (storeCredentialStatus?.data?.error_code) {
                return next(storeCredentialStatus?.data);
            }
            return res.status(200).json({
                credentialHash,
                verifiedCredential: {
                    ...verifiedCredential,
                    id: generateDid(companyName, credentialHash),
                },
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
    createClaimantCredentialWithPolicyId: async (req, res, next) => {
        try {
            logger.apiInfo(
                req,
                res,
                "Request API: Request create claimant credential with the same policy-id!"
            );
            const { credentials, mintingConfig } = req.body;
            const undefinedVar = checkUndefinedVar({
                credentials,
                mintingConfig,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const credentialResponse =
                await CardanoHelper.storeCredentialsWithPolicyId({
                    credentials,
                    mintingConfig,
                    accessToken,
                });
            if (credentialResponse?.data?.code !== 0) {
                return next({
                    ...ERRORS.CREDENTIAL_FAILED,
                    detail: credentialResponse?.data,
                });
            }
            const storeCredentialsPromises = credentials?.map(
                async (credential) => {
                    const storeCredentialStatus =
                        await ControllerHelper.storeCredentials({
                            payload: credential,
                            accessToken,
                        });
                    if (storeCredentialStatus?.data?.error_code) {
                        return next(storeCredentialStatus?.data);
                    }
                }
            );
            return res.status(200).json(credentialResponse?.data);
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
    addClaimant: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Request add claimant!");
            const { credential, verifiedCredential } = req.body;
            const undefinedVar = checkUndefinedVar({
                credential,
                verifiedCredential,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const plotDid =
                verifiedCredential?.credentialSubject?.claims?.plotCertificate;
            const companyName = plotDid?.split(":")[2];
            const plotCertificationFileName = plotDid?.split(":")[3];
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const isExistedResponse = await ControllerHelper.isExisted({
                accessToken: accessToken,
                companyName: companyName,
                fileName: plotCertificationFileName,
            });
            if (!isExistedResponse?.data?.isExisted) {
                return res.status(200).json({
                    isExisted: false,
                    plotDid: plotDid,
                });
            }
            const documentContentResponse = await getDocumentContentByDid({
                accessToken: accessToken,
                did: plotDid,
            });
            if (documentContentResponse?.error_code) {
                return next(ERRORS?.CANNOT_FOUND_DID_DOCUMENT);
            }
            if (!documentContentResponse?.wrappedDoc?.mintingConfig) {
                return next({
                    ...ERRORS.CANNOT_GET_DOCUMENT_INFORMATION,
                    detail: "Missing minting config!",
                });
            }
            const mintingConfig =
                documentContentResponse?.wrappedDoc?.mintingConfig;
            const credentialResponse = await CardanoHelper.storeCredentials({
                mintingConfig,
                credentialHash: credential,
                accessToken,
            });
            if (credentialResponse?.data?.code !== 0) {
                return next({
                    ...ERRORS.CREDENTIAL_FAILED,
                    detail: credentialResponse?.data,
                });
            }
            verifiedCredential.credentialSubject = {
                claims: { ...verifiedCredential.credentialSubject.claims },
                id: generateDid(companyName, credential),
            };
            const storeCredentialStatus =
                await ControllerHelper.storeCredentials({
                    payload: {
                        ...verifiedCredential,
                        id: generateDid(companyName, credential),
                    },
                    accessToken,
                });
            if (storeCredentialStatus?.data?.error_code) {
                return next(storeCredentialStatus?.data);
            }
            logger.apiInfo(req, res, "Add claimant successfully!");
            return res.status(200).json({
                credentialHash: credential,
                verifiedCredential: {
                    ...verifiedCredential,
                    id: generateDid(companyName, credential),
                },
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
