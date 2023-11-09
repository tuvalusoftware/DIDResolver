import mongoose from "mongoose";
import { Logger } from "tslog";
import { env } from "../configs/constants.js";
import "dotenv/config";

const logger = new Logger();

/**
 * Connects to a MongoDB database using the environment variables MONGO_PORT and MONGO_DB_NAME.
 * @returns {void}
 */
const MongoHelper = () => {
    const port = env.MONGO_PORT;
    const dbName = env.MONGO_DB_NAME;
    const dbUrl = `mongodb://localhost:${port}/${dbName}`;

    return {
        async connect() {
            mongoose
                .connect(dbUrl)
                .then(() => {
                    return logger.info(`Successfully connected to ${dbUrl}`);
                })
                .catch((error) => {
                    logger.error(`Error connecting to database: ${error}`);
                    return process.exit(1);
                });
        },
    };
};

export default MongoHelper;
