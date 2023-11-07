import axios from "axios";
import "dotenv/config";
import {
    getCurrentDateTime,
    generateRandomString,
    validateDID,
} from "../../../utils/index.js";
import {
    isLastestCertificate,
    fetchEndorsementChain,
} from "../../../utils/document.js";
import { createClaimantVerifiableCredential } from "../../../utils/credential.js";
import { unsalt } from "../../../fuixlabs-documentor/utils/data.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import logger from "../../../../logger.js";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { handleServerError } from "../../../configs/errors/errorHandler.js";
import { REQUEST_TYPE as RABBIT_REQUEST_TYPE } from "../../../rabbit/config.js";
import ControllerService from "../../../services/Controller.service.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import credentialService from "../../../services/VerifiableCredential.service.js";
import schemaValidator from "../../../helpers/validator.js";
import DocumentService from "../../../services/Document.service.js";

// * Constants
import { ERRORS } from "../../../configs/errors/error.constants.js";
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import requestSchema from "../../../configs/schemas/request.schema.js";

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
    createPlotCertification: async (req, res, next) => {
        try {
            const { plot } = schemaValidator(
                requestSchema.createCertificateForPlot,
                req.body
            );
            const plotCertificationFileName = `PlotCertification-${plot?._id}`;
            const companyName = env.COMPANY_NAME;
            logger.apiInfo(
                req,
                res,
                `Pdf file name: ${plotCertificationFileName}`
            );
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
            const plotDetailForm = {
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
            const { wrappedDocument } = await DocumentService(
                accessToken
            ).issueBySignByAdmin(plotDetailForm, companyName);
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
            const { plot } = schemaValidator(
                requestSchema.createCertificateForPlot,
                req.body
            );
            const companyName = env.COMPANY_NAME;
            const plotCertificationFileName = `PlotCertification-${
                plot?._id
            }-${generateRandomString(plot._id, 4)}`;
            const documentDid = generateDid(
                companyName,
                plotCertificationFileName
            );
            const accessToken =
                env.NODE_ENV === "test"
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
            const plotDetailForm = {
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
            const { wrappedDocument } = await DocumentService(
                accessToken
            ).issueBySignByAdmin(plotDetailForm, companyName);
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
            const { did } = schemaValidator(
                requestSchema.revokeCertificateForPlot,
                req.body
            );
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
    checkLastestVersion: async (req, res, next) => {
        try {
            const { did, hash } = schemaValidator(
                requestSchema.checkLastestVersion,
                req.body
            );
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
            const { plotDid, claimant } = schemaValidator(
                requestSchema.addClaimantToPlot,
                req.body
            );
            const { valid } = validateDID(plotDid);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const plotId = plotDid.split(":")[3].split("-")[1];
            const companyName = env.COMPANY_NAME;
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
            const accessToken =
                await AuthenticationService().authenticationProgress();
            const documentContentResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did: plotDid,
            });
            const { mintingConfig } = documentContentResponse?.data?.wrappedDoc;
            const request = await RequestRepo.createRequest({
                data: {
                    mintingConfig,
                    credential: credentialHash,
                    verifiedCredential: verifiableCredential,
                    companyName,
                },
                type: REQUEST_TYPE.MINTING_TYPE.createClaimantCredential,
                status: "pending",
            });
            await CardanoService(accessToken).storeCredentialsWithPolicyId({
                credentials: [credentialHash],
                mintingConfig,
                id: request?._id,
            });
            return res.status(200).json({
                did,
            });
        } catch (error) {
            next(handleServerError(error));
        }
    },
};
