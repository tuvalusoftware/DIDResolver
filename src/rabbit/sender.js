import { CardanoService, getSender } from "./index.js";

const { sender: cardanoSender, cardanoQueue } = getSender({
    service: CardanoService,
});

export const CardanoSender = async ({ type, data, _id }) => {
    const message = {
        type,
        data,
        _id,
    };
    cardanoSender.sendToQueue(
        cardanoQueue,
        Buffer.from(JSON.stringify(message))
    );
};
