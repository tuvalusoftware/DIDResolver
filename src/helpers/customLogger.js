import dotenv from "dotenv";
import { createRequire } from "module";
import { fileURLToPath } from "node:url";
import Logger from "../../logger.js";
dotenv.config();

const customLogger = (pathToLog) => {
    const require = createRequire(import.meta.url);
    const __filename = fileURLToPath(import.meta.url);
    const logger = Logger(__filename);
    const customLogger = logger.createCustomLogger(pathToLog);

    return {
        info: (message) => {
            customLogger.info(message);
        },
        warning: (message) => {
            customlogger.info(message);
        },
        error: (message) => {
            customLogger.error(message);
        },
        debug: (message) => {
            customLogger.debug(message);
        },
    };
};

export default customLogger;
