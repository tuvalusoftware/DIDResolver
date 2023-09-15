import axios from "axios";
import { checkUndefinedVar } from "../../../core/index.js";
import { ERRORS, SERVERS } from "../../../core/constants.js";
import { apiInfo, apiError } from "../../../logger.js";

axios.defaults.withCredentials = true;

export default {
  getNFTs: async function (req, res) {
    const { access_token } = req.cookies;
    const { policyid: policyId } = req.headers;

    try {
      const undefinedVar = checkUndefinedVar({ policyId });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const { data } = await axios.post(
        `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
        {
          policyId: policyId,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
        }
      );

      if (data.code) {
        apiError(req, res, `${JSON.stringify(data)}`);
        return res.status.json(ERRORS.CANNOT_FETCH_NFT);
      } else {
        // apiInfo(req, res, `Success.\n${JSON.stringify(data)}`);
        return res.status(200).json(data.data);
      }
    } catch (error) {
      // apiInfo(req, res, `${JSON.stringify(error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },

  verifyHash: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { hashofdocument, policyid } = req.headers;

    try {
      // Handle input errors
      const undefinedVar = checkUndefinedVar({
        hashofdocument,
        policyid,
      });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      let query = { policyId: policyid },
        undefinedCheck = { policyid };
      if (hashofdocument) {
        query = { asset: `${policyid}${hashofdocument}` };
        undefinedCheck = { ...undefinedCheck, hashofdocument };
      }

      const { data } = await axios.post(
        `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
        query,
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      );

      if (data.code) {
        apiError(req, res, `${JSON.stringify(data)}`);
        return res.status.json(ERRORS.CANNOT_FETCH_NFT);
      }
      return res.status(200).json(data.data);
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error?.message || error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },

  verifySignature: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { address, payload, signature, key } = req.headers;

    try {
      // Handle input error
      const undefinedVar = checkUndefinedVar({
        address,
        payload,
        signature,
        key,
      });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const { data } = await axios.post(
        SERVERS.CARDANO_SERVICE + "/api/v2/verify/signature",
        {
          address: address,
          payload: payload,
          signature: signature,
          key: key,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      );

      if (data?.code === 0) {
        return res.status(200).json(data);
      }
      apiError(req, res, `${JSON.stringify(data)}`);
      return res.status(200).json(data);
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error?.message || error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
};
