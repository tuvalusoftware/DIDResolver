import dotenv from "dotenv";
import { createRequire } from "module";
import { fileURLToPath } from "node:url";
import Logger from "../../libs/logger.js";
import customLogger from "../../helpers/customLogger.js";
import schemaValidator from "../../helpers/validator.js";
import ControllerService from "../../services/Controller.service.js";
import requestSchema from "../../configs/schemas/request.schema.js";
import DocumentRepository from "../../db/repos/documentRepo.js";
import { env } from "../../configs/constants.js";

dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const logger = Logger(__filename);

const pathToLog =
    env.NODE_ENV === "test"
        ? "logs/plot/create-test-task.log"
        : "logs/plot/create-task.log";
const taskLogger = customLogger(pathToLog);

export default {
    createDocument: async (req, res, next) => {
        logger.apiInfo(req, "CREATE DOCUMENT");

        try {
            const { wrappedDoc, fileName, type, companyName, chain } =
                schemaValidator(requestSchema.createDocument, req.body);

            logger.apiInfo(`Create document: ${fileName}`);

            const { txHash, assetName, did } =
                await DocumentRepository.createDocument(
                    wrappedDoc,
                    fileName,
                    type,
                    companyName
                );

            logger.apiInfo(
                req,
                `Create plot certification v2 ${did} successfully \n`
            );
            taskLogger.info(
                `Create plot certification v2 ${did} successfully with transactionId ${txHash}, hashOfDocument ${assetName}\n`
            );

            return res.status(200).json({
                txHash,
                assetName,
                did,
            });
        } catch (error) {
            next(error);
        }
    },
    updateDocument: async (req, res, next) => {
        logger.apiInfo(req, "UPDATE DOCUMENT");

        try {
        } catch (error) {
            next(error);
        }
    },
    getAllDocuments: async (req, res, next) => {
        logger.apiInfo(req, "GET ALL DOCUMENTS");

        try {
        } catch (error) {
            next(error);
        }
    },
    getDocumentByDid: async (req, res, next) => {
        logger.apiInfo(req, "GET DOCUMENT BY DID");

        try {

            const { did } = req.params;
            schemaValidator(requestSchema.getDocumentContentByDid, {
                did,
            });

            const document = await ControllerService().getDocumentContent({
                did,
            });

            return res.status(200).json(document);
        } catch (error) {
            next(error);
        }
    },
};
