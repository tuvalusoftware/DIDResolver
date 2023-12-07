import { createLogger, format, transports } from "winston";

const customLogLevel = (logLevel) => {
    return {
        error: "ERROR",
        warn: "WARN",
        info: "INFO",
    }[logLevel];
};

// Formatting logging string
const formatConfig = format.combine(
    format.timestamp({
        format: "MMM-DD-YYYY HH:mm:ss",
    }),
    format.align(),
    format.printf(
        (info) =>
            `[${customLogLevel(info.level)}] - [${[info.timestamp]}]: ${
                info.message
            }`
    )
);

// Info logger
let infoLogConfigs = {
    transports:
        process.env.NODE_ENV !== "test"
            ? [
                  new transports.File({
                      filename: "logs/server.log",
                  }),
                  new transports.Console({
                      format: format.combine(format.colorize({ all: true })),
                  }),
              ]
            : [
                  new transports.File({
                      filename: "logs/server-test.log",
                      options: { flags: "w" },
                  }),
              ],
    format: formatConfig,
};

// Debugging/Error logger
const debugLogConfigs = {
    transports: [
        new transports.File({
            filename:
                process.env.NODE_ENV !== "test"
                    ? "logs/debug.log"
                    : "logs/debug-test.log",
        }),
    ],
    format: formatConfig,
};

const infoLogger = createLogger(infoLogConfigs);
const debugLogger = createLogger(debugLogConfigs);

/**
 * @description Return a URL include a file and its parent folder
 * @param {String} filePath Path to a file
 * @returns {String|null}
 */
function simplifyFilePath(filePath) {
    if (!filePath || typeof filePath !== "string") {
        return null;
    }
    let pathArray = filePath.split("/");
    if (pathArray.length < 2) {
        return null;
    }
    let fileName = pathArray.pop();
    let parentFolder = pathArray.pop();
    return parentFolder + "/" + fileName;
}

const Logger = (fileName) => {
    const simplifiedFilePath = simplifyFilePath(fileName);

    return {
        createCustomLogger(logFilePath) {
            const customLogConfigs = {
                transports: [
                    new transports.File({
                        filename: logFilePath,
                    }),
                ],
                format: formatConfig,
            };

            return createLogger(customLogConfigs);
        },
        /**
         * @description Log info
         * @param {String} message
         */
        info(message) {
            infoLogger.info(message);
        },

        /**
         * @description warn info
         * @param {String} message
         */
        warning(message) {
            infoLogger.warn(message);
        },

        /**
         * @description Log when a function is triggered
         * @param {String} functionInfo Name of function
         */
        functionInfo(functionInfo) {
            infoLogger.info(`[${simplifiedFilePath}] ${functionInfo}`);
        },

        /**
         * @description Log when an API is called
         * @param {Request} req API request
         * @param {String} message
         */
        apiInfo(req, message) {
            infoLogger.info(`[${req.method} - ${req.originalUrl}] ${message}`);
        },

        /**
         * @description Log an error
         * @param {String | Error | { error_message: String, error_code: Number, error_detail: String }} message
         */
        error(message) {
            const err = message;

            if (typeof err === "string") {
                infoLogger.error(message);
                debugLogger.error(message);
            } else if (err instanceof Error) {
                const errorMsg = this.displayDefaultError(err);
                infoLogger.error(errorMsg);
                debugLogger.error(errorMsg);
            } else {
                infoLogger.error(
                    `${err.error_message} - Code: ${err.error_code} - Additional Detail: ${err.error_detail}`
                );
                debugLogger.error(
                    `${err.error_message} - Code: ${err.error_code} - Additional Detail: ${err.error_detail}`
                );
            }
        },

        /**
         * @description error logging when an API is called
         * @param {Request} req API request
         * @param {Error|{error_code: Number, error_message: String, error_detail: String}} err Custom or default error object
         */
        apiError(req, err) {
            const errorMsg =
                err instanceof Error
                    ? this.displayDefaultError(err)
                    : `${err.error_message} - ${err.error_detail}`;

            infoLogger.error(`[${req.method} - ${req.url}] ${errorMsg}`);
            debugLogger.error(`[${req.method} - ${req.url}] ${errorMsg}`);
        },
        /**
         * @description Returns a formatted string representation of a JavaScript error object.
         * @param {Error} err The JavaScript error object.
         * @returns {String}
         */
        displayDefaultError(err) {
            let message = `\n- Error Name (err.name): "${err.name}" \n- Error Message (err.message): "${err.message}" \n- Error Type (err.constructor.name): "${err.constructor.name}" \n- Error Code (err.code): "${err.code}"\n\n`;

            // Include any additional error attributes
            message += "Inspect each fields of error: \n";
            for (const attr in err) {
                if (
                    err.hasOwnProperty(attr) &&
                    typeof err[attr] !== "function"
                ) {
                    message += `- ${attr}: ${err[attr]}\n`;
                }
            }

            // Include stack trace if available
            if (err.stack) {
                message += `\nStack Trace:\n${err.stack}`;
            }

            // Errors to String
            if (err instanceof Error) {
                message += `\n\nError.toString(): ${err.toString()}`;
            }

            return message;
        },
    };
};

export default Logger;
