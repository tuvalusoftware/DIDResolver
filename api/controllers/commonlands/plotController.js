import axios from "axios";
import { apiError } from "../../../logger.js";
import { ERRORS, SERVERS } from "../../../core/constants.js";
import { checkUndefinedVar } from "../../../core/index.js";
import { sha256 } from "js-sha256";
// const lib = require("cardano-crypto.js");
// const { Buffer } = require("node:buffer");

export default {
  getPlotDetailByPlotId: async (req, res) => {
    const accessToken = process.env.COMMONLANDS_ACCESS_TOKEN;
    const { plotId } = req.query;
    try {
      const undefinedVar = checkUndefinedVar({ plotId });
      if (undefinedVar?.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const plotResponse = await axios.get(
        `${SERVERS.STAGING_SERVER}/api/plot/${plotId}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (plotResponse?.status !== 200) {
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
