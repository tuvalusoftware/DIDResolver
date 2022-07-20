import { createLogger, format, transports } from "winston";
import { ERRORS } from "./core/constants";

const customeLogLevel = (logLevel) => {
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
  ],
  format: formatConfig,
};

const infoLogger = createLogger(infoLogConfigs);

export default {
  info(message) {
    infoLogger.info(message);
  },
  apiInfo(req, res, message) {
    infoLogger.info(`[${req.method} - ${req.originalUrl}] ${message}`);
  },
  apiError(err, req, res) {
    infoLogger.error(
      `[${req.method} - ${req.originalUrl}] ${err.error_message}`
    );
    debugLogger.error(
      `[${req.method} - ${req.originalUrl}] ${err.error_message}`
    );
  },
};
