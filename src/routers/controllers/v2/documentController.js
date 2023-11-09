import axios from "axios";
import "dotenv/config";
import logger from "../../../../logger.js";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { REQUEST_TYPE as RABBIT_REQUEST_TYPE } from "../../../rabbit/config.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import credentialService from "../../../services/VerifiableCredential.service.js";
import schemaValidator from "../../../helpers/validator.js";

// * Constants
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import requestSchema from "../../../configs/schemas/request.schema.js";

axios.defaults.withCredentials = true;

export default {
    createPlotCertification: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Create Plot Certification`);
            const { plot, status } = schemaValidator(
                requestSchema.createCertificateForPlot,
                req.body
            );
            const companyName = env.COMPANY_NAME;
            const accessToken =
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const response = await DocumentService(
                accessToken
            ).createWrappedDocumentData(
                { ...plot, status },
                WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE,
                companyName
            );
            if (response?.isExisted) {
                return res.status(200).json(response.wrappedDocument);
            }
            const { dataForm, did } = response;
            const { wrappedDocument } = await DocumentService(
                accessToken
            ).issueBySignByAdmin(dataForm, companyName);
            const claimantsCredentialDids =
                await credentialService.getCredentialDidsFromClaimants({
                    claimants: plot?.claimants,
                    did,
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
            logger.apiInfo(req, res, `Document DID: ${did}`);
            return res.status(200).json(claimantsCredentialDids);
        } catch (error) {
            next(error);
        }
    },
};
