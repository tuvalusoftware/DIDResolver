import axios from "axios";
import dotenv from "dotenv";
import { createRequire } from "module";
import { fileURLToPath } from "node:url";
import Logger from "../../../libs/logger.js";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import CardanoService from "../../../services/Cardano.service.js";
import DocumentService from "../../../services/Document.service.js";
import ControllerService from "../../../services/Controller.service.js";
import { asyncWrapper } from "../../middlewares/async.js";

// * Constants
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import wrappedDocumentSchema from "../../../configs/schemas/wrappedDocument.schema.js";
import { AppError } from "../../../configs/errors/appError.js";
import { ERRORS } from "../../../configs/errors/error.constants.js";

axios.defaults.withCredentials = true;

dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const logger = Logger(__filename);

export default {
    createContract: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, `Create contract v2`);
        const { wrappedDoc, metadata } = schemaValidator(
            requestSchema.createContract,
            req.body
        );
        const companyName = env.COMPANY_NAME;
        const { fileName } = DocumentService().generateFileNameForDocument(
            wrappedDoc,
            WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT
        );
        const did = generateDid(companyName, fileName);
        const isExistedResponse = await ControllerService().isExisted({
            companyName,
            fileName,
        });
        if (isExistedResponse.data?.isExisted) {
            logger.warning(`Document ${did} is existed`);
            const getDocumentResponse =
                await ControllerService().getDocumentContent({
                    did,
                });
            if (!getDocumentResponse?.data) {
                logger.error(`Document ${did} dose not have data`);
                throw new AppError(ERRORS.INVALID_INPUT);
            }
            const { wrappedDoc } = getDocumentResponse.data;
            return {
                isExisted: true,
                wrappedDocument: wrappedDoc,
            };
        }
        const { dataForm } = await DocumentService().createWrappedDocumentData(
            fileName,
            wrappedDoc,
            WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT
        );
        schemaValidator(wrappedDocumentSchema.dataForIssueDocument, dataForm);
        const { wrappedDocument } = await DocumentService().issueBySignByAdmin(
            dataForm,
            companyName
        );
        const request = await RequestRepo.createRequest({
            data: {
                wrappedDocument,
                metadata,
            },
            type: REQUEST_TYPE.MINTING_TYPE.createContract,
            status: "pending",
        });
        await CardanoService().storeToken({
            hash: wrappedDocument?.signature?.targetHash,
            id: request._id,
            type: "document",
        });
        return res.status(200).json({
            did,
        });
    }),
};
