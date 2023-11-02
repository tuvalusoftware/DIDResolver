/* c8 ignore start */
import { createLogger, format, transports, addColors } from "winston";
import { Request, Response, NextFunction } from "express";

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

const infoLogger = createLogger(infoLogConfigs),
    debugLogger = createLogger(debugLogConfigs);

const info = (message: string): void => {
    infoLogger.info(message);
};
// Log general error such as syntax error, errors that have not been catch, or more detail on how an error occurred
const error = (error: any): void => {
    infoLogger.error(error);
};
const apiInfo = (req: Request, res: Response, message: any): any => {
    infoLogger.info(`[${req.method} - ${req.originalUrl}]\n${message}`);
};
// Log error that occurs when an API is called (most of these errors are catch)
const apiError = (req: Request, res: Response, error: any): any => {
    infoLogger.error(`[${req.method} - ${req.originalUrl}]\n${error}`);
};

export { info, error, apiInfo, apiError };
export default { info, error, apiInfo, apiError };
/* c8 ignore stop */
