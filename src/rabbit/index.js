import amqplib from "amqplib";
import { Logger } from "tslog";
import { env } from "../configs/constants.js";
import { RABBITMQ_SERVICE } from "./config.js";

const logger = new Logger();

let rabbitMQ;

try {
    rabbitMQ = await amqplib.connect({
        protocol: "amqp",
        hostname: env.RABBITMQ_SERVICE,
        username: "guest",
        password: "1",
    });
    logger.debug(
        "Connected to RabbitMQ",
        rabbitMQ?.connection?.serverProperties?.cluster_name
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

/**
 * Returns the sender and queue for a given service.
 * @param {Object} options - The options object.
 * @param {string} options.service - The name of the service.
 * @returns {Object} - An object containing the sender and queue for the given service.
 */
export function getSender({ service }) {
    return {
        sender: channel[service],
        queue: queue[service],
    };
}
