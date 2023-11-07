import logger from "../../../../logger.js";
import { ERRORS } from "../../../configs/errors/error.constants.js";
import { unsalt } from "../../../fuixlabs-documentor/utils/data.js";
import { checkUndefinedVar } from "../../../utils/index.js";
import { handleServerError } from "../../../configs/errors/errorHandler.js";

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
            const { data } = req.body;
            const undefinedVar = checkUndefinedVar({ data });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
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
