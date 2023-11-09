import { Logger } from "tslog";
import MongoHelper from "./src/libs/connectMongo.js";
import { setUpApp } from "./src/configs/setup/app.js";
import { env } from "./src/configs/constants.js";
import http from "http";

const logger = new Logger();

MongoHelper()
    .connect()
    .then(async () => {
        const app = await setUpApp();
        const server = http.createServer(app);
        server.timeout = env.SERVER_TIMEOUT;
        const port = env.NODE_ENV !== "test" ? env.SERVER_PORT : 8001;
        server.listen(port, () => {
            logger.info(`Environment: ${env.NODE_ENV}`);
            logger.info(`Server is live: http://localhost:${port}`);
        });
    })
    .catch((error) => {
        logger.error(`Error connecting to database: ${error}`);
    });
