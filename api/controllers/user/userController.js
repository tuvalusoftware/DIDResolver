// * Utilities
import logger from "../../../logger.js";
import { checkUndefinedVar } from "../../../core/index.js";
import "dotenv/config";

// * Constants
import { ERRORS } from "../../../core/constants.js";

export default {
  getUserDid: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, "Get user did");
      const { key } = req.query;
      const undefinedVar = checkUndefinedVar({
        key,
      });
      if (undefinedVar?.undefined) {
        return next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const companyName = process.env.COMPANY_NAME;
      const useDid = `did:fuixlabs:${companyName}:${key}`;
      logger.apiInfo(req, res, `User did: ${useDid}`);
      return res.status(200).json({
        did: useDid,
      });
    } catch (error) {
      error?.error_code
        ? next(error)
        : next({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
};
