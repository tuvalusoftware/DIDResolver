import * as rabbit from "../../rabbit/index.js";
import { ResolverConsumer } from "../../rabbit/rabbit.consumer.js";

export const setUpRabbitMq = async (app) => {
    await ResolverConsumer();
};
