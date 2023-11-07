import mongoose from "mongoose";
import { Logger } from "tslog";
import { env } from "../configs/constants.js";
import "dotenv/config";

const logger = new Logger();

/**
 * Connects to a MongoDB database using the environment variables MONGO_PORT and MONGO_DB_NAME.
 * @returns {void}
 */
export default () => {
    const port = env.MONGO_PORT;
    const dbName = env.MONGO_DB_NAME;
    const dbUrl = `mongodb://localhost:${port}/${dbName}`;

    const connect = () => {
        mongoose
            .connect(dbUrl)
            .then(() => {
                return logger.debug(`Successfully connected to ${dbUrl}`);
            })
            .catch((error) => {
                logger.error(`Error connecting to database: ${error}`);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on("disconnected", connect);
};
