import { getSender } from "./index.js";
import { RABBITMQ_SERVICE } from "./config.js";
import { env } from "../configs/constants.js";
import customLogger from "../helpers/customLogger.js";

const pathToLog =
    env.NODE_ENV === "test"
        ? "logs/rabbit/test-task.log"
        : "logs/rabbit/task.log";
const logger = customLogger(pathToLog);

const { sender: cardanoSender, queue: cardanoQueue } = getSender({
    service: RABBITMQ_SERVICE.CardanoService,
});
const { sender: resolverSender, queue: resolverQueue } = getSender({
    service: RABBITMQ_SERVICE.ResolverService,
});

const { sender: errorSender, queue: errorQueue } = getSender({
    service: RABBITMQ_SERVICE.ErrorService,
});
