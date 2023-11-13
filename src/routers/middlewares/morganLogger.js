import morgan from "morgan";

import { env } from "../../configs/constants.js";
import Logger from "../../../logger.js";

const stream = {
    write: (message) =>
        Logger.info(message.substring(0, message.lastIndexOf("\n"))),
};

const skip = () => {
    return env.NODE_ENV === "production";
};

const morganMiddleware = morgan(":method :url (:status) - :response-time ms", {
    stream,
    skip,
});

export default morganMiddleware;
