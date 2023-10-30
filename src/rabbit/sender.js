import { getSender } from "./index.js";
import { RABBITMQ_SERVICE } from "./config.js";

const { sender: cardanoSender, queue: cardanoQueue } = getSender({
    service: RABBITMQ_SERVICE.CardanoService,
});

export const CardanoSender = async ({ type, data, id, options }) => {
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
