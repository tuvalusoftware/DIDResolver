import { getSender } from "./index.js";
import { RABBITMQ_SERVICE } from "./config.js";

const { sender: cardanoSender, queue: cardanoQueue } = getSender({
    service: RABBITMQ_SERVICE.CardanoService,
});

const { sender: errorSender, queue: errorQueue } = getSender({
    service: RABBITMQ_SERVICE.ErrorService,
});

export const CardanoProducer = async ({ type, data, id, options }) => {
    const message = {
        type,
        data,
        id,
        options,
    };
    cardanoSender.sendToQueue(
        cardanoQueue,
        Buffer.from(JSON.stringify(message)),
        {
            durable: true,
        }
    );
};

export const ErrorProducer = async ({ type, data, id, options }) => {
    const message = {
        type,
        data,
        id,
        options,
    };
    errorSender.sendToQueue(errorQueue, Buffer.from(JSON.stringify(message)), {
        durable: true,
    });
};
