import { REQUEST_TYPE } from "../../../configs/constants.js";
import { ERRORS } from "../../../configs/errors/error.constants.js";
import logger from "../../../../logger.js";
import { checkUndefinedVar, validateDID } from "../../../utils/index.js";
import { unsalt } from "../../../fuixlabs-documentor/utils/data.js";
import { createClaimantVerifiableCredential } from "../../../utils/credential.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import ControllerService from "../../../services/Controller.service.js";
import AuthenticationService from "../../../services/Authentication.service.js";

import "dotenv/config";
import CardanoService from "../../../services/Cardano.service.js";

/**
 * Controller object containing functions for handling document creation, revocation, and plot document creation.
 */
export default {
    /**
     * Revoke a document with the given DID.
     * @async
     * @function revokeDocument
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @returns {Object} The response object with a status of 200 and a JSON object containing the revoked status and document data.
     */
    revokeDocument: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Request revoke document!");
            const { did } = req.body;
            const undefinedVar = checkUndefinedVar({
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const documentContentResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did,
            });
            const mintingConfig =
                documentContentResponse?.data?.wrappedDoc?.mintingConfig;
            await CardanoService(accessToken).burnToken({
                mintingConfig,
            });
            return res.status(200).json({
                revoked: true,
                data: documentContentResponse?.data?.wrappedDoc,
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
     * Create a document with the given wrapped document, company name, URL, and DID.
     * @async
     * @function createDocument
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @returns {Object} The response object with a status of 200 and a JSON object containing the URL and DID.
     */
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
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const mintingResponse = await CardanoService(
                accessToken
            ).storeToken({
                hash: wrappedDocument?.signature?.targetHash,
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
            const storeWrappedDocumentStatus = await ControllerService(
                accessToken
            ).storeDocument({
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
            const didResponse = await ControllerService(
                accessToken
            ).getDocumentDid({
                did: did,
            });
            if (!didResponse?.data?.didDoc) {
                return next(ERRORS.CANNOT_GET_DID_DOCUMENT);
            }
            const updateDidDoc = {
                ...didResponse?.data?.didDoc,
                pdfUrl: url,
            };
            const updateDidDocResponse = await ControllerService(
                accessToken
            ).updateDocumentDid({
                did: did,
                didDoc: updateDidDoc,
            });
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
    /**
     * Create a plot document with the given wrapped document, plot, DID, and company name.
     * @async
     * @function createPlotDocument
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
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
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const mintingResponse = await CardanoService(
                accessToken
            ).storeToken({
                hash: wrappedDocument?.signature?.targetHash,
            });

            if (mintingResponse?.data?.code !== 0) {
                return next({
                    ...ERRORS.CANNOT_MINT_NFT,
                    detail: mintingResponse?.data,
                });
            }
            const mintingConfig = mintingResponse?.data?.data;
            const willWrappedDocument = {
                ...wrappedDocument,
                mintingConfig,
            };
            const fileName = unsalt(willWrappedDocument?.data?.fileName);
            logger.apiInfo(req, res, `File name: ${fileName}`);

            await ControllerService(accessToken).storeDocument({
                companyName,
                fileName,
                wrappedDocument: willWrappedDocument,
            });
            const claimants = plot?.claimants;
            let claimantData = [];
            if (claimants) {
                const promises = claimants?.map(async (claimant) => {
                    const { verifiableCredential, credentialHash } =
                        await createClaimantVerifiableCredential({
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
    updatePlotDocument: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Request update plot!");
            const { wrappedDocument, plot, did, companyName, mintingConfig } =
                req.body;
            const undefinedVar = checkUndefinedVar({
                wrappedDocument,
                plot,
                did,
                mintingConfig,
                companyName,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const accessToken =
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const updateResponse = await CardanoService(
                accessToken
            ).updateToken({
                hash: wrappedDocument?.signature?.targetHash,
                mintingConfig,
                did,
            });
            const updateConfig = updateResponse?.data?.data;
            let updateWrappedDocument = {
                ...wrappedDocument,
                mintingConfig: updateConfig,
            };
            const fileName = did.split(":")[3];
            await ControllerService(
                accessToken
            ).storeDocument({
                companyName,
                fileName,
                wrappedDocument: updateWrappedDocument,
            });
            const claimants = plot?.claimants;
            let claimantData = [];
            if (claimants) {
                const promises = claimants?.map(async (claimant) => {
                    const { verifiableCredential, credentialHash } =
                        await createClaimantVerifiableCredential({
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
    }, // TODO: Write unit-test
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
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const credentialResponse = await CardanoService(
                accessToken
            ).storeCredentials({
                mintingConfig,
                credentialHash: credentialHash,
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
            logger.apiInfo(req, res, JSON.stringify(verifiedCredential));
            const storeCredentialStatus = await ControllerService(
                accessToken
            ).storeCredentials({
                payload: {
                    ...verifiedCredential,
                    id: generateDid(companyName, credentialHash),
                },
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
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const credentialResponse = await CardanoService(
                accessToken
            ).storeCredentialsWithPolicyId({
                credentials,
                mintingConfig,
            });
            if (credentialResponse?.data?.code !== 0) {
                return next({
                    ...ERRORS.CREDENTIAL_FAILED,
                    detail: credentialResponse?.data,
                });
            }
            const storeCredentialsPromises = credentials?.map(
                async (credential) => {
                    const storeCredentialStatus = await ControllerService(
                        accessToken
                    ).storeCredentials({
                        payload: credential,
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
    }, // TODO: Write unit-test
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
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const isExistedResponse = await ControllerService(
                accessToken
            ).isExisted({
                companyName: companyName,
                fileName: plotCertificationFileName,
            });
            if (!isExistedResponse?.data?.isExisted) {
                return res.status(200).json({
                    isExisted: false,
                    plotDid: plotDid,
                });
            }
            const documentContentResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did: plotDid,
            });
            if (!documentContentResponse?.data?.wrappedDoc?.mintingConfig) {
                return next({
                    ...ERRORS.CANNOT_GET_DOCUMENT_INFORMATION,
                    detail: "Missing minting config!",
                });
            }
            const mintingConfig =
                documentContentResponse?.data?.wrappedDoc?.mintingConfig;
            const credentialResponse = await CardanoService(
                accessToken
            ).storeCredentials({
                mintingConfig,
                credentialHash: credential,
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
            const storeCredentialStatus = await ControllerService(
                accessToken
            ).storeCredentials({
                payload: {
                    ...verifiedCredential,
                    id: generateDid(companyName, credential),
                },
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
    }, // TODO: Write unit-test
};
