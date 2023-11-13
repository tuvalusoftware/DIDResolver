import express from "express";
import { setUpMiddleware } from "./middleware.js";
import { setUpErrorHandler } from "./errorHandler.js";
import { setUpRoute } from "./route.js";
import { setUpSwagger } from "./swagger.js";
import { setUpRabbitMq } from "./rabbitmq.js";
import { setUpCron } from "./cron.js";

export const setUpApp = async () => {
    const app = express();
    setUpMiddleware(app);
    setUpRoute(app);
    setUpSwagger(app);
    setUpErrorHandler(app);
    setUpCron(app);
    await setUpRabbitMq(app);
    return app;
};
