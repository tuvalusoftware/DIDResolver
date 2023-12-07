import { AppError } from "../../configs/errors/appError.js";
import { ERRORS } from "../../configs/errors/error.constants.js";

const errorHandlerMiddleware = (err, req, res, next) => {
    try {
        if (err.code === "ECONNABORTED") {
            throw new AppError(ERRORS.CONNECTION_TIMEOUT);
        }
        if (err.code === "ECONNREFUSED") {
            throw new AppError(ERRORS.CONNECTION_REFUSED);
        }
        if (err instanceof AppError) {
            throw err;
        }
        throw new AppError(ERRORS.INTERNAL_SERVER_ERROR);
    } catch (error) {
        return res.status(200).json(error.getAppError());
    }
};

export { errorHandlerMiddleware };
