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
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import wrappedDocumentSchema from "../../../configs/schemas/wrappedDocument.schema.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";

axios.defaults.withCredentials = true;

export default {
    getDocument: asyncWrapper(async (req, res, next) => {
        const { did } = schemaValidator(requestSchema.did, req.params);
        const accessToken =
            env.NODE_ENV === "test"
                ? "mock-access-token"
                : await AuthenticationService().authenticationProgress();
        const docContentResponse = await ControllerService(
            accessToken
        ).getDocumentContent({
            did,
        });
        const { targetHash } = docContentResponse?.data?.wrappedDoc?.signature;
        return res.status(200).json({
            hash: targetHash,
            did,
        });
    }),
    createPlotCertification: asyncWrapper(async (req, res, next) => {
        const { plot } = schemaValidator(
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
            plot,
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
    updatePlotCertification: asyncWrapper(async (req, res, next) => {
        const { plot } = schemaValidator(
            requestSchema.createCertificateForPlot,
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
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE,
            true
        );
        const did = generateDid(companyName, fileName);
        const { dataForm } = await DocumentService(
            accessToken
        ).createWrappedDocumentData(
            fileName,
            plot,
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
                companyName,
                did,
                plot,
                claimants: claimantsCredentialDids,
                originDid: plot.did,
            },
            type: RABBIT_REQUEST_TYPE.MINTING_TYPE.updatePlot,
            status: "pending",
        });
        return res.status(200).json(claimantsCredentialDids);
    }),
    revokePlotCertification: asyncWrapper(async (req, res, next) => {
        const { did } = schemaValidator(
            requestSchema.revokeCertificateForPlot,
            req.body
        );
        const accessToken =
            env.NODE_ENV === "test"
                ? "mock-access-token"
                : await AuthenticationService().authenticationProgress();
        const documentContentResponse = await ControllerService(
            accessToken
        ).getDocumentContent({
            did,
        });
        const { mintingConfig } = documentContentResponse.data?.wrappedDoc;
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
    }),
    checkLastestVersion: asyncWrapper(async (req, res, next) => {
        const { did, hash } = schemaValidator(
            requestSchema.checkLastestVersion,
            req.body
        );
        const accessToken =
            await AuthenticationService().authenticationProgress();
        const endorsementChain = await DocumentService(
            accessToken
        ).getEndorsementChainByDid(did);
        const isLastest = await DocumentService(
            accessToken
        ).checkLastestCertificate(hash, endorsementChain);
        return res.status(200).json(isLastest);
    }),
    addClaimantToCertificate: asyncWrapper(async (req, res, next) => {
        const { plotDid, claimant } = schemaValidator(
            requestSchema.addClaimantToPlot,
            req.body
        );
        const plotId = plotDid.split(":")[3].split("-")[1];
        const companyName = env.COMPANY_NAME;
        const { verifiableCredential, credentialHash, did } =
            await credentialService.createClaimantVerifiableCredential({
                subject: {
                    claims: {
                        plot: plotId,
                        ...claimant,
                    },
                },
                issuerKey: plotDid,
            });
        const request = await RequestRepo.createRequest({
            data: {
                credential: credentialHash,
                verifiedCredential: verifiableCredential,
                companyName,
                originDid: plotDid,
            },
            type: REQUEST_TYPE.MINTING_TYPE.addClaimantToPlot,
            status: "pending",
        });
        return res.status(200).json({
            did,
        });
    }),
};
