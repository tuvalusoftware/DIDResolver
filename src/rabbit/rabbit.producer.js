import { getSender } from "./index.js";
import { RABBITMQ_SERVICE } from "./config.js";

const { sender: cardanoSender, queue: cardanoQueue } = getSender({
    service: RABBITMQ_SERVICE.CardanoService,
});

/**
 * Sends a message to the Cardano queue.
 * @param {Object} params - The parameters object.
 * @param {string} params.type - The type of the message.
 * @param {Object} params.data - The data to be sent.
 * @param {string} params.id - The ID of the message.
 * @param {Object} params.options - The options for the message.
 * @returns {Promise<void>} - A Promise that resolves when the message is sent.
 */
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
