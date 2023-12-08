import axios from "axios";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { REQUEST_TYPE as RABBIT_REQUEST_TYPE } from "../../../rabbit/config.js";
import ControllerService from "../../../services/Controller.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import credentialService from "../../../services/VerifiableCredential.service.js";
import schemaValidator from "../../../helpers/validator.js";
import DocumentService from "../../../services/Document.service.js";
import { asyncWrapper } from "../../middlewares/async.js";
import dotenv from "dotenv";
import { createRequire } from "module";
import { fileURLToPath } from "node:url";
import Logger from "../../../libs/logger.js";

// * Constants
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import wrappedDocumentSchema from "../../../configs/schemas/wrappedDocument.schema.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";

axios.defaults.withCredentials = true;
dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const logger = Logger(__filename);

export default {
    getDocument: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Get document v1");
        const { did } = schemaValidator(requestSchema.did, req.params);
        const docContentResponse = await ControllerService().getDocumentContent(
            {
                did,
            }
        );
        if (!docContentResponse?.data?.wrappedDoc?.signature?.targetHash) {
            logger.apiInfo(req, `There are no targetHash in document ${did}`);
            return res.status(200).json({
                hash: null,
                did,
            });
        }
        const { targetHash } = docContentResponse.data.wrappedDoc.signature;
        return res.status(200).json({
            hash: targetHash,
            did,
        });
    }),
    createPlotCertification: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Create plot certification v1");
        const { plot } = schemaValidator(
            requestSchema.createCertificateForPlot,
            req.body
        );
        const companyName = env.COMPANY_NAME;
        const { fileName } = DocumentService().generateFileNameForDocument(
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE
        );
        const did = generateDid(companyName, fileName);
        const isExistedResponse = await ControllerService().isExisted({
            companyName,
            fileName,
        });
        if (isExistedResponse.data?.isExisted) {
            logger.warning(`Document ${fileName} is existed`);
            const _claimantsCredentialDids =
                await credentialService.getCredentialDidsFromClaimants({
                    claimants: plot.claimants,
                    did,
                    companyName,
                    plotId: plot._id,
                });
            return res.status(200).json(_claimantsCredentialDids);
        }
        const { dataForm } = await DocumentService().createWrappedDocumentData(
            fileName,
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE
        );
        schemaValidator(wrappedDocumentSchema.dataForIssueDocument, dataForm);
        const { wrappedDocument } = await DocumentService().issueBySignByAdmin(
            dataForm,
            companyName
        );
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
        await CardanoService().storeToken({
            hash: wrappedDocument?.signature?.targetHash,
            id: request._id,
        });
        return res.status(200).json(claimantsCredentialDids);
    }),
    updatePlotCertification: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Update plot certification v1");
        const { plot } = schemaValidator(
            requestSchema.createCertificateForPlot,
            req.body
        );
        const companyName = env.COMPANY_NAME;
        const { fileName } = DocumentService().generateFileNameForDocument(
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE,
            true
        );
        const did = generateDid(companyName, fileName);
        const { dataForm } = await DocumentService().createWrappedDocumentData(
            fileName,
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE
        );
        schemaValidator(wrappedDocumentSchema.dataForIssueDocument, dataForm);
        const { wrappedDocument } = await DocumentService().issueBySignByAdmin(
            dataForm,
            companyName
        );
        const claimantsCredentialDids =
            await credentialService.getCredentialDidsFromClaimants({
                claimants: plot.claimants,
                did,
                companyName,
                plotId: plot._id,
            });
        await RequestRepo.createRequest({
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
        logger.apiInfo(req, "Revoke plot certification v1");
        const { did } = schemaValidator(
            requestSchema.revokeCertificateForPlot,
            req.body
        );
        const documentContentResponse =
            await ControllerService().getDocumentContent({
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
        await CardanoService().burnToken({
            mintingConfig,
            id: request._id,
        });
        return res.status(200).json({
            success: true,
        });
    }),
    checkLastestVersion: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Check lastest version v1");
        const { did, hash } = schemaValidator(
            requestSchema.checkLastestVersion,
            req.body
        );
        const endorsementChain =
            await DocumentService().getEndorsementChainByDid(did);
        const isLastest = await DocumentService().checkLastestCertificate(
            hash,
            endorsementChain
        );
        return res.status(200).json(isLastest);
    }),
    addClaimantToCertificate: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Add claimant to certificate v1");
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
        await RequestRepo.createRequest({
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
