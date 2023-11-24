import axios from "axios";
import "dotenv/config";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { REQUEST_TYPE as RABBIT_REQUEST_TYPE } from "../../../rabbit/config.js";
import ControllerService from "../../../services/Controller.service.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import credentialService from "../../../services/VerifiableCredential.service.js";
import schemaValidator from "../../../helpers/validator.js";
import DocumentService from "../../../services/Document.service.js";
import { asyncWrapper } from "../../middlewares/async.js";

// * Constants
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import wrappedDocumentSchema from "../../../configs/schemas/wrappedDocument.schema.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";

axios.defaults.withCredentials = true;

export default {
    createPlotCertification: asyncWrapper(async (req, res, next) => {
        const { plot, status } = schemaValidator(
            requestSchema.createCertificateForPlot,
            req.body
        );
        const companyName = env.COMPANY_NAME;
        const accessToken =
            env.NODE_ENV === "test"
                ? "mock-access-token"
                : await AuthenticationService().authenticationProgress();
        const { fileName } = DocumentService(
            accessToken
        ).generateFileNameForDocument(
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE
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
            const { wrappedDoc } = getDocumentResponse.data;
            return res.status(200).json(wrappedDoc);
        }
        const { dataForm } = await DocumentService(
            accessToken
        ).createWrappedDocumentData(
            fileName,
            { ...plot, status },
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE
        );
        schemaValidator(wrappedDocumentSchema.dataForIssueDocument, dataForm);
        const { wrappedDocument } = await DocumentService(
            accessToken
        ).issueBySignByAdmin(dataForm, companyName);
        const claimantsCredentialDids =
            await credentialService.getCredentialDidsFromClaimants({
                claimants: plot.claimants,
                did,
                companyName,
                plotId: plot._id,
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
        return res.status(200).json(claimantsCredentialDids);
    }),
};
