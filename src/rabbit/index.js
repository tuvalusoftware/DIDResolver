import amqplib from "amqplib";
import { Logger } from "tslog";
import { SERVERS } from "../config/constants.js";
import { RABBITMQ_SERVICE } from "./config.js";

const logger = new Logger();

let rabbitMQ;

try {
    rabbitMQ = await amqplib.connect(SERVERS.RABBITMQ_SERVICE);
    logger.debug(
        "Connected to RabbitMQ",
        rabbitMQ?.connection?.serverProperties?.cluster_name
    );
} catch (error) {
    logger.error("Error connecting to RabbitMQ", error);
}

const queue = {
    CardanoService: RABBITMQ_SERVICE.CardanoService,
    ResolverService: RABBITMQ_SERVICE.ResolverService,
};

const cardanoChannel = await rabbitMQ.createChannel();
await cardanoChannel.assertQueue(queue[RABBITMQ_SERVICE.CardanoService], {
    durable: true,
});

const resolverChanel = await rabbitMQ.createChannel();
await resolverChanel.assertQueue(queue[RABBITMQ_SERVICE.ResolverService], {
    durable: true,
});

const channel = {
    CardanoService: cardanoChannel,
    ResolverService: resolverChanel,
};

export function getSender({ service }) {
    return {
        sender: channel[service],
        queue: queue[service],
    };
}