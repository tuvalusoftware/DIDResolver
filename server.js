import { Logger } from "tslog";
import MongoHelper from "./src/libs/connectMongo.js";
import { setUpApp } from "./src/configs/setup/app.js";
import { env } from "./src/configs/constants.js";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import morganMiddleware from "./src/routers/middlewares/morganLogger.js";
import http from "http";
import express from "express";
import routes from "./src/routers/routes/index.js";
import { setUpErrorHandler } from "./src/configs/setup/errorHandler.js";
import connectRabbitMQ from "./src/configs/setup/rabbitmq.js";
import morgen from "morgan";
import { setUpSwagger } from "./src/configs/setup/swagger.js";
import { setUpCron } from "./src/configs/setup/cron.js";

const logger = new Logger();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json({ limit: "200mb" }));
app.use(
    bodyParser.urlencoded({
        limit: "200mb",
        extended: true,
        parameterLimit: 1000000,
    })
);
app.use(methodOverride());
app.use(morgen("tiny"));
app.use(
    express.urlencoded({
        extended: true,
    })
);
MongoHelper();
app.use(morganMiddleware);
routes(app);
app.use(express.static("assets"));
setUpSwagger(app);
setUpErrorHandler(app);
connectRabbitMQ();
setUpCron();

const port = env.NODE_ENV !== "test" ? env.SERVER_PORT : 8001;
app.listen(port, () => {
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`Server is live: http://localhost:${port}`);
});

export default app;
