import amqplib from "amqplib";
import { Logger } from "tslog";
import { SERVERS } from "../config/constants.js";

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
export const CardanoService = "CardanoService";
export const TaskQueue = "TaskQueue";

const queue = {
    CardanoService: CardanoService,
    TaskQueue: TaskQueue,
};

const cardanoChannel = await rabbitMQ.createChannel();
await cardanoChannel.assertQueue(queue[CardanoService], { durable: true });

const taskChannel = await rabbitMQ.createChannel();
await taskChannel.assertQueue(queue[TaskQueue], { durable: true });

const channel = {
    CardanoService: cardanoChannel,
    TaskQueue: taskChannel,
};

channel[TaskQueue].consume(queue[TaskQueue], async (msg) => {
    if (msg !== null) {
        logger.info("[TaskQueue] 🔈", msg.content.toString());
        channel[TaskQueue].ack(msg);
    }
});

export function getSender({ service }) {
    return {
        sender: channel[service],
        queue: queue[service],
    };
}
