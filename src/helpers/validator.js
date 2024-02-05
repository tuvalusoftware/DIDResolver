import { ERRORS } from "../configs/errors/error.constants.js";
import { AppError } from "../configs/errors/appError.js";

export default (schema, source) => {
    try {
        const { error } = schema.validate(source);
        if (!error) {
            return source;
        }
        const { details } = error;
        const message = details
            .map((i) => i.message.replace(/['"]+/g, ""))
            .join(",");
        throw new AppError(ERRORS.INVALID_INPUT, message);
    } catch (error) {
        throw error;
    }
};
