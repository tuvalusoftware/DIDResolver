import { ERRORS } from "../errors/error.constants.js";
import { env } from "../constants.js";
import logger from "../../../logger.js";
import { AppError } from "../errors/appError.js";

export const setUpErrorHandler = (app) => {
    app.use((err, req, res, _) => {
        try {
            env.NODE_ENV !== "test" && logger.error(err.toString());
            if (err.code === "ECONNABORTED") {
                throw new AppError(ERRORS.CONNECTION_TIMEOUT);
            }
            if (err.code === "ECONNREFUSED") {
                throw new AppError(ERRORS.CONNECTION_REFUSED);
            }
            if (err instanceof AppError) {
                throw err;
            }
            throw new AppError(ERRORS.INTERNAL_SERVER_ERROR, err.toString());
        } catch (error) {
            return res.status(200).json(error.getAppError());
        }
    });
};
