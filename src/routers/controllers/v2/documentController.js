// * Constants
import { ERRORS } from "../../../configs/errors/error.constants.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import {
    checkUndefinedVar,
    getCurrentDateTime,
    getPublicKeyFromAddress,
} from "../../../utils/index.js";
import { createDocumentTaskQueue } from "../../../utils/document.js";
import { getAccountBySeedPhrase } from "../../../utils/lucid.js";
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
import { env } from "../../../configs/constants.js";

axios.defaults.withCredentials = true;

export default {
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
                    seedPhrase: env.ADMIN_SEED_PHRASE,
                }
            );
            const { wrappedDocument } = await createDocumentTaskQueue({
                seedPhrase: env.ADMIN_SEED_PHRASE,
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
};
