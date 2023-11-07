import logger from "../../../../logger.js";
import { unsalt } from "../../../fuixlabs-documentor/utils/data.js";
import { handleServerError } from "../../../configs/errors/errorHandler.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";

/**
 * Controller for unsalting data.
 * @async
 * @function unsaltData
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - Returns a JSON object with unsalted data.
 * @throws {Object} - Throws an error object with error code and message.
 */
export default {
    unsaltData: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "API Request: Unsalt data");
            const { data } = schemaValidator(
                requestSchema.unsaltData,
                req.body
            );
            const unsaltedData = unsalt(data);
            return res.status(200).json({
                success: true,
                status_message: "Unsalted data successfully!",
                data: unsaltedData,
            });
        } catch (error) {
            next(handleServerError(error));
        }
    },
};
