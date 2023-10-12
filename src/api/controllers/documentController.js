// * Constants
import { REQUEST_TYPE } from "../../config/constants.js";
import { ERRORS } from "../../config/errors/error.constants.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import {
    checkUndefinedVar,
    getCurrentDateTime,
    getPublicKeyFromAddress,
    generateRandomString,
    validateDID,
} from "../utils/index.js";
import {
    hashDocumentContent,
    isLastestCertificate,
    fetchEndorsementChain,
    createDocumentTaskQueue,
} from "../utils/document.js";
import { getAccountBySeedPhrase } from "../utils/lucid.js";
import {
    getDocumentContentByDid,
    getDidDocumentByDid,
} from "../utils/controller.js";
import { createVerifiableCredential } from "../utils/credential.js";
import { unsalt } from "../../fuixlabs-documentor/utils/data.js";
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import logger from "../../../logger.js";
import {
    AuthHelper,
    ControllerHelper,
    TaskQueueHelper,
    VerifiableCredentialHelper,
} from "../../helpers/index.js";
import { validateJSONSchema } from "../utils/index.js";

axios.defaults.withCredentials = true;

export default {
    getDocument: async (req, res, next) => {
        try {
            const { did } = req.params;
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const didDocumentResponse = await getDidDocumentByDid({
                did: did,
                accessToken: accessToken,
            });
            if (didDocumentResponse?.error_code) {
                return next(
                    didDocumentResponse || ERRORS.CANNOT_GET_DID_DOCUMENT
                );
            }
            const url = didDocumentResponse?.didDoc?.pdfUrl;
            if (!url) {
                return next(ERRORS.CANNOT_GET_CONTRACT_URL);
            }
            const docContentResponse = await getDocumentContentByDid({
                did: did,
                accessToken: accessToken,
            });
            if (docContentResponse?.error_code) {
                return next(
                    docContentResponse || ERRORS.CANNOT_GET_DOCUMENT_INFORMATION
                );
            }
            const hash = docContentResponse?.wrappedDoc?.signature?.targetHash;
            return res.status(200).json({
                success: true,
                url: url,
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
    }, //
    createPlotCertification: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Create Plot Certification`);
            const { plot } = req.body;
            const undefinedVar = checkUndefinedVar({
                plot,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const plotCertificationFileName = `PlotCertification-${plot?._id}`;
            const companyName = process.env.COMPANY_NAME;
            logger.apiInfo(
                req,
                res,
                `Pdf file name: ${plotCertificationFileName}`
            );
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const isCronExists = await TaskQueueHelper.isExisted({
                did: generateDid(companyName, plotCertificationFileName),
            });
            logger.apiInfo(
                req,
                res,
                isCronExists?.data
            );
            if (isCronExists?.data?.isExists) {
                return res
                    .status(200)
                    .json(isCronExists?.data?.data?.claimants);
            }
            const isExistedResponse = await ControllerHelper.isExisted({
                accessToken: accessToken,
                companyName: companyName,
                fileName: plotCertificationFileName,
            });
            if (isExistedResponse?.data?.isExisted) {
                logger.apiInfo(
                    req,
                    res,
                    `Document ${plotCertificationFileName} existed`
                );
                const existedDidDoc = await getDidDocumentByDid({
                    accessToken: accessToken,
                    did: generateDid(companyName, plotCertificationFileName),
                });
                if (existedDidDoc?.error_code) {
                    return next(ERRORS?.CANNOT_FOUND_DID_DOCUMENT);
                }
                return res.status(200).json({
                    isExisted: true,
                });
            }
            let plotDetailForm = {
                profileImage: "sampleProfileImage",
                fileName: plotCertificationFileName,
                name: `Land Certificate`,
                title: `Land-Certificate-${plot?.name}`,
                No: generateRandomString(plot._id, 7),
                dateIssue: getCurrentDateTime(),
                plotInformation: {
                    plotName: plot?.name,
                    plotId: plot?.id,
                    plot_Id: plot?._id,
                    plotStatus: plot?.status,
                    plotLocation: plot?.placeName,
                    plotCoordinates: plot?.centroid?.join(","),
                    plotNeighbors: plot?.neighbors?.length,
                    plotDisputes: plot?.disputes?.length,
                    plotStatus: plot?.status,
                },
            };
            const { currentWallet, lucidClient } = await getAccountBySeedPhrase(
                {
                    seedPhrase: process.env.ADMIN_SEED_PHRASE,
                }
            );
            const { wrappedDocument } = await createDocumentTaskQueue({
                seedPhrase: process.env.ADMIN_SEED_PHRASE,
                documents: [plotDetailForm],
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                access_token: accessToken,
                client: lucidClient,
                currentWallet: currentWallet,
                companyName: companyName,
            });
            const documentDid = generateDid(
                companyName,
                unsalt(wrappedDocument?.data?.fileName)
            );
            if (!documentDid) {
                return next(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
            }
            const claimantsCredentialDids =
                await VerifiableCredentialHelper.getCredentialDidsFromClaimants(
                    {
                        claimants: plot?.claimants,
                        did: documentDid,
                        companyName,
                        plotId: plot?._id,
                    }
                );
            await TaskQueueHelper.sendMintingRequest({
                data: {
                    wrappedDocument,
                    companyName,
                    did: documentDid,
                    plot,
                    claimants: claimantsCredentialDids,
                },
                type: REQUEST_TYPE.PLOT_MINT,
                did: documentDid,
            });
            return res.status(200).json(claimantsCredentialDids);
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
    updatePlotCertification: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Update Plot Certification`);
            const { plot } = req.body;
            const undefinedVar = checkUndefinedVar({
                plot,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateJSONSchema(
                {
                    type: "object",
                    required: ["did"],
                    properties: {
                        did: {
                            type: "string",
                        },
                    },
                    additionalProperties: true,
                },
                plot
            );
            if (!valid) {
                return next(ERRORS.INVALID_INPUT);
            }
            const companyName = process.env.COMPANY_NAME;
            const plotCertificationFileName = `PlotCertification-${
                plot?._id
            }-${generateRandomString(plot._id, 4)}`;
            const documentDid = generateDid(
                companyName,
                plotCertificationFileName
            );
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const requestsResponse =
                await TaskQueueHelper.findRequestsRelatedToDid({
                    did: plot?.did,
                });
            const relatedRequests = requestsResponse?.data?.requests;
            if (
                relatedRequests?.length > 0 &&
                relatedRequests.find(
                    (request) =>
                        request?.type === REQUEST_TYPE.UPDATE ||
                        request?.did === documentDid
                )
            ) {
                const cronedRequest = relatedRequests.find(
                    (request) =>
                        request?.type === REQUEST_TYPE.UPDATE ||
                        request?.did === documentDid
                );
                return res.status(200).json(cronedRequest?.data?.claimants);
            }
            const documentContentResponse = await getDocumentContentByDid({
                did: plot?.did,
                accessToken: accessToken,
            });
            if (!documentContentResponse.wrappedDoc) {
                return next(ERRORS.DOCUMENT_IS_NOT_EXISTED);
            }
            const mintingConfig = {
                ...documentContentResponse?.wrappedDoc?.mintingNFTConfig,
            };
            if (!mintingConfig) {
                return next({
                    ...ERRORS.CANNOT_GET_DOCUMENT_INFORMATION,
                    detail: "Missing minting config",
                });
            }
            mintingConfig.policy = {
                ...mintingConfig.policy,
                reuse: true,
            };
            let plotDetailForm = {
                profileImage: "sampleProfileImage",
                fileName: plotCertificationFileName,
                name: `Land Certificate`,
                title: `Land-Certificate-${plot?.name}`,
                No: generateRandomString(plot._id, 7),
                dateIssue: getCurrentDateTime(),
                plotInformation: {
                    plotName: plot?.name,
                    plotId: plot?.id,
                    plot_Id: plot?._id,
                    plotStatus: plot?.status,
                    plotLocation: plot?.placeName,
                    plotCoordinates: plot?.centroid?.join(","),
                    plotNeighbors: plot?.neighbors?.length,
                    plotDisputes: plot?.disputes?.length,
                    plotStatus: plot?.status,
                },
            };
            const { currentWallet, lucidClient } = await getAccountBySeedPhrase(
                {
                    seedPhrase: process.env.ADMIN_SEED_PHRASE,
                }
            );
            const { wrappedDocument } = await createDocumentTaskQueue({
                seedPhrase: process.env.ADMIN_SEED_PHRASE,
                documents: [plotDetailForm],
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                access_token: accessToken,
                client: lucidClient,
                currentWallet: currentWallet,
                companyName: companyName,
            });
            const claimantsCredentialDids =
                await VerifiableCredentialHelper.getCredentialDidsFromClaimants(
                    {
                        claimants: plot?.claimants,
                        did: documentDid,
                        companyName,
                        plotId: plot?._id,
                    }
                );
            await TaskQueueHelper.sendMintingRequest({
                data: {
                    wrappedDocument,
                    mintingConfig,
                    companyName,
                    did: documentDid,
                    plot,
                    claimants: claimantsCredentialDids,
                },
                type: REQUEST_TYPE.UPDATE,
                did: documentDid,
            });
            return res.status(200).json(claimantsCredentialDids);
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
    hashDocument: async (req, res, next) => {
        try {
            const { plot, claimant } = req.body;
            const undefinedVar = checkUndefinedVar({
                plot,
                claimant,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const pdfFileName =
                `LandCertificate-${claimant?.phoneNumber?.replace("+", "")}-${
                    plot?._id
                }` || "";
            const plotDetailForm = {
                profileImage: "sampleProfileImage",
                fileName: pdfFileName,
                name: `Land Certificate`,
                title: `Land-Certificate-${plot?.name || ""}`,
                No: plot?.no || "CML21566325",
                dateIssue: getCurrentDateTime(),
                personalInformation: {
                    claimant: claimant?.fullName || "",
                    right: claimant?.role || "",
                    phoneNumber: claimant?.phoneNumber || "",
                    claimrank: "okay",
                    description:
                        "Okay is the starting point. This level may have some boundaries unverified and may include one boundary dispute. If there is an ownership dispute of a plot but and one of the owners is part of a claimchain and the other’s has not completed a claimchain, the completed claimchain person will be listed as Okay. ",
                },
                plotInformation: {
                    plotName: plot?.name || "",
                    plotId: plot?.id || "",
                    plotStatus: "Free & Clear",
                    plotPeople: "Verified by 3 claimants, 6 Neighbors",
                    plotLocation: plot?.placeName || "",
                },
                certificateByCommonlands: {
                    name: "Commonlands System LLC",
                },
                certificateByCEO: {
                    name: "Darius Golkar",
                },
            };
            const { currentWallet } = await getAccountBySeedPhrase({
                seedPhrase: process.env.ADMIN_SEED_PHRASE,
            });

            const targetHash = await hashDocumentContent({
                document: plotDetailForm,
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
            });
            logger.apiInfo(req, res, `Hash of document: ${targetHash}`);
            return res.status(200).json({
                targetHash,
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
    }, //
    getEndorsementChainOfCertificate: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Get Endorsement Chain`);
            const { did } = req.params;
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken = await AuthHelper.authenticationProgress();
            const endorsementChain = await fetchEndorsementChain({
                did: did,
                accessToken: accessToken,
            });
            return res.status(200).json(endorsementChain);
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
    checkLastestVersion: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Check Lastest Version`);
            const { did, hash } = req.body;
            const undefinedVar = checkUndefinedVar({
                hash,
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken = await AuthHelper.authenticationProgress();
            const endorsementChain = await fetchEndorsementChain({
                did: did,
                accessToken: accessToken,
            });
            const isLastest = await isLastestCertificate({
                currentHash: hash,
                endorsementChain: endorsementChain,
            });
            return res.status(200).json(isLastest);
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
    }, // ...
    verifyCertificateQrCode: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Verify Certificate Qr Code`);
            const { hash, did } = req.query;
            const undefinedVar = checkUndefinedVar({
                hash,
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken = await AuthHelper.authenticationProgress();
            const endorsementChain = await fetchEndorsementChain({
                did: did,
                accessToken: accessToken,
            });
            const verifierPromises = [
                await isLastestCertificate({
                    currentHash: hash,
                    endorsementChain: endorsementChain,
                }),
            ];
            Promise.allSettled(verifierPromises)
                .then((data) => {
                    const notPassVerifiers = data.filter(
                        (obj) => obj?.value?.valid === false
                    );
                    if (notPassVerifiers?.length === 0) {
                        logger.apiInfo(
                            req,
                            res,
                            `Verified successfully! ${did} is valid!`
                        );
                        return res.status(200).json({
                            success: true,
                            success_message: "Verified successfully!",
                            isValid: true,
                        });
                    }
                    return next({
                        ...ERRORS.CERTIFICATE_IS_NOT_VALID,
                        detail: notPassVerifiers
                            .map((obj) => obj?.value?.verifier_message)
                            .join("; "),
                    });
                })
                .catch((error) => {
                    return next(error);
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
    addClaimantToCertificate: async (req, res, next) => {
        try {
            const { plotDid, claimant } = req.body;
            const undefinedVar = checkUndefinedVar({
                plotDid,
                claimant,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(plotDid);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            if (!plotDid || !claimant.did || !claimant.role) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: "Invalid credential subject",
                });
            }
            const plotId = plotDid.split(":")[3].split("-")[1];
            const companyName = process.env.COMPANY_NAME;
            const { verifiableCredential, credentialHash, did } =
                await createVerifiableCredential({
                    subject: {
                        claims: {
                            plot: plotId,
                            ...claimant,
                        },
                    },
                    issuerKey: plotDid,
                });
            const isCronExists = await TaskQueueHelper.isExisted({
                did,
            });
            if (isCronExists?.data?.isExists) {
                return res.status(200).json({
                    did: isCronExists?.data?.data?.verifiedCredential
                        ?.credentialSubject?.id,
                });
            }
            const taskQueueResponse = await TaskQueueHelper.sendMintingRequest({
                data: {
                    credential: credentialHash,
                    verifiedCredential: verifiableCredential,
                },
                type: REQUEST_TYPE.ADD_CLAIMANT,
                did: generateDid(companyName, credentialHash),
            });

            return res.status(200).json({
                did: taskQueueResponse?.data?.data?.did,
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
    }, //
};
