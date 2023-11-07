// * Constants
import { ERRORS } from "../../configs/errors/error.constants.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import {
    checkUndefinedVar,
    getCurrentDateTime,
    getPublicKeyFromAddress,
    generateRandomString,
    validateDID,
} from "../../utils/index.js";
import {
    hashDocumentContent,
    isLastestCertificate,
    fetchEndorsementChain,
    createDocumentTaskQueue,
} from "../../utils/document.js";
import { getAccountBySeedPhrase } from "../../utils/lucid.js";
import { createClaimantVerifiableCredential } from "../../utils/credential.js";
import { unsalt } from "../../fuixlabs-documentor/utils/data.js";
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import logger from "../../../logger.js";
import { validateJSONSchema } from "../../utils/index.js";
import RequestRepo from "../../db/repos/requestRepo.js";
import { handleServerError } from "../../configs/errors/errorHandler.js";
import { REQUEST_TYPE as RABBIT_REQUEST_TYPE } from "../../rabbit/config.js";
import ControllerService from "../../services/Controller.service.js";
import AuthenticationService from "../../services/Authentication.service.js";
import CardanoService from "../../services/Cardano.service.js";
import credentialService from "../../services/VerifiableCredential.service.js";

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
    createPlotCertification: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Create Plot Certification`);
            const { plot, status } = req.body;
            const undefinedVar = checkUndefinedVar({
                plot,
                status,
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
                    : await AuthenticationService().authenticationProgress();
            const isExistedResponse = await ControllerService(
                accessToken
            ).isExisted({
                companyName: companyName,
                fileName: plotCertificationFileName,
            });
            if (isExistedResponse?.data?.isExisted) {
                logger.apiInfo(
                    req,
                    res,
                    `Document ${plotCertificationFileName} existed`
                );
                const existedDidDoc = await ControllerService(
                    accessToken
                ).getDocumentDid({
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
                dateIssue: getCurrentDateTime(),
                status: status,
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
                await credentialService.getCredentialDidsFromClaimants({
                    claimants: plot?.claimants,
                    did: documentDid,
                    companyName,
                    plotId: plot?._id,
                });
            const request = await RequestRepo.createRequest({
                data: {
                    wrappedDocument,
                    claimants: claimantsCredentialDids,
                    plot,
                },
                type: RABBIT_REQUEST_TYPE.MINTING_TYPE.createPlot,
                status: "pending",
            });
            await CardanoService(accessToken).storeToken({
                hash: wrappedDocument?.signature?.targetHash,
                id: request._id,
            });
            logger.apiInfo(req, res, `Document DID: ${documentDid}`);
            return res.status(200).json(claimantsCredentialDids);
        } catch (error) {
            next(handleServerError(error));
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
                    : await AuthenticationService().authenticationProgress();
            const documentContentResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did: plot?.did,
            });
            let mintingConfig = {
                ...documentContentResponse?.data?.wrappedDoc?.mintingConfig,
            };
            if (!mintingConfig) {
                return next({
                    ...ERRORS.CANNOT_GET_DOCUMENT_INFORMATION,
                    detail: "Missing minting config",
                });
            }
            mintingConfig = {
                ...mintingConfig,
                reuse: true,
            };
            let plotDetailForm = {
                profileImage: "sampleProfileImage",
                fileName: plotCertificationFileName,
                name: `Land Certificate`,
                title: `Land-Certificate-${plot?.name}`,
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
                await credentialService.getCredentialDidsFromClaimants({
                    claimants: plot?.claimants,
                    did: documentDid,
                    companyName,
                    plotId: plot?._id,
                });
            const request = await RequestRepo.createRequest({
                data: {
                    wrappedDocument,
                    mintingConfig,
                    companyName,
                    did: documentDid,
                    plot,
                    claimants: claimantsCredentialDids,
                },
                type: RABBIT_REQUEST_TYPE.MINTING_TYPE.updatePlot,
                status: "pending",
            });
            await CardanoService(accessToken).updateToken({
                hash: wrappedDocument?.signature?.targetHash,
                mintingConfig,
                id: request._id,
            });
            return res.status(200).json(claimantsCredentialDids);
        } catch (error) {
            next(handleServerError(error));
        }
    },
    revokePlotCertification: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Revoke Plot Certification`);
            const { did } = req.body;
            const undefinedVar = checkUndefinedVar({
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
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const documentContentResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did,
            });
            const { mintingConfig } = documentContentResponse?.data?.wrappedDoc;
            const request = await RequestRepo.createRequest({
                data: {
                    mintingConfig,
                    did,
                },
                type: RABBIT_REQUEST_TYPE.MINTING_TYPE.deletePlot,
                status: "pending",
            });
            await CardanoService(accessToken).burnToken({
                mintingConfig,
                id: request._id,
            });
            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            next(handleServerError(error));
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
            next(handleServerError(error));
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
            const accessToken =
                await AuthenticationService().authenticationProgress();
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
            next(handleServerError(error));
        }
    },
    addClaimantToCertificate: async (req, res, next) => {
        try {
            logger.apiInfo(
                req,
                res,
                `API Request: Add Claimant To Certificate`
            );
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
                await createClaimantVerifiableCredential({
                    subject: {
                        claims: {
                            plot: plotId,
                            ...claimant,
                        },
                    },
                    issuerKey: plotDid,
                });
            return res.status(200).json({
                did: taskQueueResponse?.data?.data?.did,
            });
        } catch (error) {
            next(handleServerError(error));
        }
    },
};
