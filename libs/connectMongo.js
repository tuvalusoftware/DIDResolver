import mongoose from "mongoose";
import logger from "../logger.js";
import "dotenv/config";

/**
 * Connects to a MongoDB database using the specified environment variables.
 * @returns {void}
 */
export default () => {
    const port = process.env.MONGO_PORT || 27017;
    const dbName = process.env.MONGO_DB_NAME || "backup-blockchain";
    const dbUrl = `mongodb://localhost:${port}/${dbName}`;

    /**
     * Connects to the MongoDB database using Mongoose.
     * @returns {void}
     */
    const connect = () => {
        mongoose
            .connect(dbUrl)
            .then(() => {
                return logger.info(`Successfully connected to ${dbUrl}`);
            })
            .catch((error) => {
                logger.apiError(`Error connecting to database: ${error}`);
                return process.exit(1);
            });
    };
    connect();

    // Reconnect to the database if the connection is lost.
    mongoose.connection.on("disconnected", connect);
};
