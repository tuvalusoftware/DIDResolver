import logger from "../../../logger.js";
import { ERRORS } from "../../config/errors/error.constants.js";
import { unsalt } from "../../fuixlabs-documentor/utils/data.js";
import { checkUndefinedVar } from "../../utils/index.js";

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
      error?.error_code
        ? next(error)
        : next({
            error_code: 400,
            error_message:
              error?.error_message || error?.message || "Something went wrong!",
          });
    }
  },
};
