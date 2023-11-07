/* c8 ignore start */
import { createLogger, format, transports, addColors } from "winston";
import { env } from "./src/configs/constants.js";

const customLogLevel = (logLevel) => {
    return {
        error: "ERROR",
        warn: "WARN",
        info: "INFO",
    }[logLevel];
};

const formatConfig = format.combine(
    format.timestamp({
        format: "MMM-DD-YYYY HH:mm:ss",
    }),
    format.align(),
    format.printf(
        (info) =>
            `[${customLogLevel(info.level)}]: [${[info.timestamp]}]: ${
                info.message
            }\n`
    )
);

let infoLogConfigs = {
    transports: [
        new transports.File({
            filename: "logs/server.log",
        }),
    ],
    format: formatConfig,
};
// Log to console if not test env
if (env.NODE_ENV !== "test") {
    infoLogConfigs.transports.push(
        new transports.Console({
            format: format.combine(format.colorize({ all: true })),
        })
    );
}

const debugLogConfigs = {
    transports: [
        new transports.File({
            filename: "logs/debug.log",
        }),
        new transports.File({
            filename: "logs/server.log",
        }),
    ],
    format: formatConfig,
};
// Log to console if not test env
if (env.NODE_ENV !== "test") {
    debugLogConfigs.transports.push(
        new transports.Console({
            format: format.combine(format.colorize({ all: true })),
        })
    );
}

const infoLogger = createLogger(infoLogConfigs),
    debugLogger = createLogger(debugLogConfigs);

const info = (message) => {
    infoLogger.info(message);
};
// Log general error such as syntax error, errors that have not been catch, or more detail on how an error occurred
const error = (error) => {
    infoLogger.error(error);
};
const apiInfo = (req, res, message) => {
    infoLogger.info(`[${req.method} - ${req.originalUrl}]\n${message}`);
};
// Log error that occurs when an API is called (most of these errors are catch)
const apiError = (req, res, error) => {
    infoLogger.error(`[${req.method} - ${req.originalUrl}]\n${error}`);
};

export { info, error, apiInfo, apiError };
export default { info, error, apiInfo, apiError };
/* c8 ignore stop */
