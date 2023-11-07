import { getSender } from "./index.js";
import { RABBITMQ_SERVICE } from "./config.js";

const { sender: cardanoSender, queue: cardanoQueue } = getSender({
    service: RABBITMQ_SERVICE.CardanoService,
});

const { sender: errorSender, queue: errorQueue } = getSender({
    service: RABBITMQ_SERVICE.ErrorService,
});

const { sender: cardanoContractSender, queue: cardanoContractQueue } =
    getSender({
        service: RABBITMQ_SERVICE.CardanoContractService,
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

export const CardanoContractProducer = async ({ type, data, id, options }) => {
    const message = {
        type,
        data,
        id,
        options,
    };
    cardanoContractSender.sendToQueue(
        cardanoContractQueue,
        Buffer.from(JSON.stringify(message)),
        {
            durable: true,
        }
    );
};
