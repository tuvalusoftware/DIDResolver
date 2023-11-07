import { ERRORS } from "../configs/errors/error.constants.js";

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
        throw {
            ...ERRORS.INVALID_INPUT,
            error_detail: message,
        };
    } catch (error) {
        throw error;
    }
};
