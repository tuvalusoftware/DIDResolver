import axios from "axios";
import { apiError } from "../../../logger.js";
import { ERRORS, SERVERS } from "../../../core/constants.js";
import { checkUndefinedVar } from "../../../core/index.js";

export default {
  getPlotDetailByPlotId: async (req, res) => {
    const accessToken = process.env.COMMONLANDS_SECRET_KEY;
    const { plotId } = req.query;
    try {
      const undefinedVar = checkUndefinedVar({ plotId });
      if (undefinedVar?.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const plotResponse = await axios.get(
        `${SERVERS?.STAGING_SERVER}/api/services/dominium/${plotId}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (plotResponse?.data?.error_code) {
        apiError(req, res, `${JSON.stringify(plotResponse?.data)}`);
        return res.status(200).json(ERRORS.CANNOT_GET_PLOT_DETAIL);
      }
      return res.status(200).json(plotResponse?.data);
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error?.message || error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
  getSeedPhrase: async (req, res) => {
    try {
      return res.status(200).json({
        message: "Get seed phrase successfully",
      });
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error?.message || error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
  hashPdf: async () => {
    try {
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error?.message || error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
};
