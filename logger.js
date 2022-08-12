const { createLogger, format, transports, addColors } = require("winston");

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
    new transports.Console(),
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
    new transports.Console(),
  ],
  format: formatConfig,
};

const infoLogger = createLogger(infoLogConfigs),
  debugLogger = createLogger(debugLogConfigs);

module.exports = {
  info: (message) => {
    infoLogger.info(message);
  },
  error: (error) => {
    infoLogger.error(error);
  },
  apiInfo: (req, res, message) => {
    infoLogger.info(`[${req.method} - ${req.originalUrl}]\n${message}`);
  },
  apiError: (req, res, error) => {
    infoLogger.error(`[${req.method} - ${req.originalUrl}]\n${error}`);
    debugLogger.error(`[${req.method} - ${req.originalUrl}]\n${error}`);
  },
};
