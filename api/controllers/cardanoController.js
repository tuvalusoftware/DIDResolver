const axios = require("axios").default;
const { checkUndefinedVar } = require("../../core");
const { ERRORS, SERVERS } = require("../../core/constants");
const Logger = require("../../logger");

module.exports = {
  getNFTs: async function (req, res) {
    const { access_token } = req.cookies;
    const { policyid: policyId } = req.headers;

    try {
      // Handle input errors
      const undefinedVar = checkUndefinedVar({ policyId });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });

      // Call Cardano Service
      // success:
      //   {
      //     code: number,
      //     message: string,
      //     data: [] or
      //   }
      // error:
      //   { code: number, message: string }
      const { data } = await axios.post(
        `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
        {
          // (opt) asset: 41ac0d6b1287d7abd2c0443566cf34f95f1ec7e338dc18653fcedcb4ec9df0f3318725fa3c636ee118d233cadf8bd4a6f654c89f164d1169cc473cdc
          policyId: policyId, // 41ac0d6b1287d7abd2c0443566cf34f95f1ec7e338dc18653fcedcb4
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      );

      Logger.apiInfo(req, res, `Success.\n${JSON.stringify(data)}`);
      return res.status(200).json(data);
    } catch (error) {
      Logger.apiInfo(req, res, `${JSON.stringify(error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },

  verifyHash: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { hashofdocument, policyid } = req.headers;
    let query = {
      policyId: policyid,
    };
    let undefinedCheck = { policyid };
    if (hashofdocument) {
      query = {
        asset: `${policyid}${hashofdocument}`,
      };
      undefinedCheck = { ...undefinedCheck, hashofdocument };
    }

    // Handle input errors
    const undefinedVar = checkUndefinedVar(undefinedCheck);
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });

    // Call Cardano Service
    // success:
    //   {
    //     code: number,
    //     message: string,
    //     data: [] or {}
    //   }
    // error:
    //   { code: number, message: string }
    const { data } = await axios
      .post(`${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`, query, {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${access_token}`,
        },
      })
      .then((response) => {
        Logger.apiInfo(req, res, `Success:\n${JSON.stringify(data)}`);
        return res.status(200).json(data);
      })
      .catch((error) => {
        Logger.apiError(req, res, error);
        return error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
  },

  verifySignature: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { address, payload, signature, key } = req.headers;

    try {
      // Handle input error
      const undefinedVar = checkUndefinedVar({ address, payload, signature });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });

      // Call Cardano Service
      // success:
      //   {
      //     code: number,
      //     message: string,
      //     data: true/false
      //   }
      // error:
      //   { code: number, message: string }
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

      Logger.apiInfo(req, res, `Success:\n${data}`);
      return res.status(200).json(data);
    } catch (error) {
      Logger.apiError(req, res, `${error}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
};
