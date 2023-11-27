import * as rabbit from "../../rabbit/index.js";
import { ResolverConsumer } from "../../rabbit/rabbit.consumer.js";
import { Logger } from "tslog";

const logger = new Logger();

export const setUpRabbitMq = async (app) => {
    await ResolverConsumer();
};

export default () => {
    const connectConsumer = () => {
        ResolverConsumer()
            .then(() => {
                logger.info("Consumer connected");
            })
            .catch((err) => {
                logger.error("Error connecting to RabbitMQ");
            });
    };
    connectConsumer();
};
