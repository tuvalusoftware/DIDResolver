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

const TWO_HOUR = 7200000;

try {
    rabbitMQ = await amqplib.connect({
        protocol: "amqp",
        hostname: env.RABBITMQ_SERVICE,
        username: env.RABBITMQ_USER,
        password: env.RABBITMQ_PASSWORD,
        heartbeat: TWO_HOUR,
    });
    logger.info(
        `Connected to RabbitMQ: ${rabbitMQ?.connection?.serverProperties?.cluster_name}`
    );
} catch (error) {
    logger.error(error);
}

const queue = {
    [RABBITMQ_SERVICE.CardanoService]: RABBITMQ_SERVICE.CardanoService,
    [RABBITMQ_SERVICE.ResolverService]: RABBITMQ_SERVICE.ResolverService,
    [RABBITMQ_SERVICE.ErrorService]: RABBITMQ_SERVICE.ErrorService,
    [RABBITMQ_SERVICE.CardanoContractService]:
        RABBITMQ_SERVICE.CardanoContractService,
};

const cardanoChannel = await rabbitMQ.createChannel();
await cardanoChannel.assertQueue(queue[RABBITMQ_SERVICE.CardanoService], {
    durable: true,
});

const resolverChanel = await rabbitMQ.createChannel();
await resolverChanel.assertQueue(queue[RABBITMQ_SERVICE.ResolverService], {
    durable: true,
});

const errorChannel = await rabbitMQ.createChannel();
await errorChannel.assertQueue(queue[RABBITMQ_SERVICE.ErrorService], {
    durable: true,
});

const cardanoContractChannel = await rabbitMQ.createChannel();
await cardanoContractChannel.assertQueue(
    queue[RABBITMQ_SERVICE.CardanoContractService],
    {
        durable: true,
    }
);

const channel = {
    [RABBITMQ_SERVICE.CardanoService]: cardanoChannel,
    [RABBITMQ_SERVICE.ResolverService]: resolverChanel,
    [RABBITMQ_SERVICE.ErrorService]: errorChannel,
    [RABBITMQ_SERVICE.CardanoContractService]: cardanoContractChannel,
};

export function getSender({ service }) {
    return {
        sender: channel[service],
        queue: queue[service],
    };
}

export { rabbitMQ };
