import amqplib from "amqplib";
import { env } from "../configs/constants.js";
import { RABBITMQ_SERVICE } from "./config.js";
import dotenv from "dotenv";

import { createRequire } from "module";
import { fileURLToPath } from "node:url";
import Logger from "../libs/logger.js";

dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const logger = Logger(__filename);

let rabbitMQ;

try {
    rabbitMQ = await amqplib.connect({
        protocol: "amqp",
        hostname: env.RABBITMQ_SERVICE,
        username: env.RABBITMQ_USER,
        password: env.RABBITMQ_PASSWORD,
        port: env.RABBITMQ_PORT,
    });
    rabbitMQ.on("error", (error) => {
        logger.error("Error with RabbitMQ");
        logger.error(error);
    });
    logger.info(
        `Connected to RabbitMQ: ${rabbitMQ?.connection?.serverProperties?.cluster_name}`
    );
} catch (error) {
    logger.error(error);
}

export { rabbitMQ };
