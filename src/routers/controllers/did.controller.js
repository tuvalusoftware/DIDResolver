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
    createDid: async (req, res, next) => {
        logger.apiInfo(req, "CREATE DID");

        try {
            const { companyName, publicKey, content } = schemaValidator(
                requestSchema.createDid,
                req.body
            );

            const { data } = await ControllerService().storeDid({
                companyName,
                publicKey,
                content,
            });

            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },
};
