import mongoose from "mongoose";
import { Logger } from "tslog";
import "dotenv/config";

const logger = new Logger();

/**
 * Connects to a MongoDB database using the environment variables MONGO_PORT and MONGO_DB_NAME.
 * @returns {void}
 */
export default () => {
    const port = process.env.MONGO_PORT || 27017;
    const dbName = process.env.MONGO_DB_NAME || "mint-queue";
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
