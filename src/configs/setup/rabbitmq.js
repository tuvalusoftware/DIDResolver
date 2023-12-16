import dotenv from "dotenv";
import { ResolverConsumer } from "../../rabbit/rabbit.consumer.js";

import { createRequire } from "module";
import { fileURLToPath } from "node:url";
import Logger from "../../libs/logger.js";

dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const logger = Logger(__filename);

export const setUpRabbitMq = async () => {
    await ResolverConsumer();
};

export default () => {
    const connectConsumer = () => {
        ResolverConsumer()
            .then(() => {
                logger.info("Resolver consumer connected");
            })
            .catch((err) => {
                logger.error("Error connecting to RabbitMQ");
            });
    };
    connectConsumer();
};
