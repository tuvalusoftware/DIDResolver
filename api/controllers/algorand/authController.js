import axios from "axios";
import Logger from "../../../logger.js";
import { ERRORS, SERVERS } from "../../../core/constants.js";
import { checkUndefinedVar } from "../../../core/index.js";
import algosdk from "algosdk";

export default {
  verifyToken: async (req, res) => {
    if (!req.cookies["access_token"]) {
      Logger.apiError(req, res, `Not found: access_token.`);
      return res.status(401).json(ERRORS.UNAUTHORIZED);
    }
    const accessToken = req.cookies["access_token"];
    try {
      const { data } = await axios.get(
        `${SERVERS.AUTHENTICATION_SERVICE}/api/auth/verify`,
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken};`,
          },
        }
      );
      return res.status(200).json({
        address: data?.data?.address,
      });
    } catch (error) {
      Logger.apiError(req, res, `${JSON.stringify(error?.message || error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
  verifyAlgorandAddress: async (req, res) => {
    const { address } = req.query;
    const undefinedVar = checkUndefinedVar({ address });
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });
    const isValidAddress = algosdk.isValidAddress(address);
    if (isValidAddress) {
      // Logger.apiInfo(
      //   req,
      //   res,
      //   `${address} is valid address from Algorand Network!`
      // );
      return res.status(200).json({
        isValidAddress,
      });
    }
    Logger.apiError(
      req,
      res,
      `${address} is not a valid address from Algorand Network!`
    );
    return res.status(200).json({
      isValidAddress,
    });
  },
};
