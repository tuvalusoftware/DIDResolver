import mongoose from "mongoose";
import { env } from "../configs/constants.js";
import dotenv from "dotenv";

import { createRequire } from "module";
import { fileURLToPath } from "node:url";
import Logger from "../../logger.js";

dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const logger = Logger(__filename);

const MongoHelper = () => {
    const port = env.MONGO_PORT;
    const dbName = env.MONGO_DB_NAME;
    const mongoHost = env.MONGO_HOST;
    const dbUrl = `mongodb://${mongoHost}:${port}/${dbName}`;

    const connect = () => {
        mongoose
            .connect(dbUrl)
            .then(() => {
                logger.info(`Successfully connected to ${dbUrl}`);
            })
            .catch((error) => {
                logger.error("Error connecting to Mongo DB ...");
                logger.error(error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on("disconnected", connect);
};

export default MongoHelper;
