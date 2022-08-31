const axios = require("axios").default;
const { ERRORS, SERVERS, SCHEMAS } = require("../../core/constants");
const {
  validateJSONSchema,
  getPublicKeyFromAddress,
  validateDIDSyntax,
  checkUndefinedVar,
} = require("../../core/index");
const Logger = require("../../logger");

axios.defaults.withCredentials = true;

module.exports = {
  retrieveUserDid: async function (req, res) {
    const { access_token } = req.cookies;
    const { companyName, publicKey } = req.body;
    try {
      const undefinedVar = checkUndefinedVar({
        companyName,
        publicKey,
      });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });

      const userDid = await axios.get(SERVERS.DID_CONTROLLER + "/api/did", {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${access_token};`,
        },
        params: {
          companyName,
          publicKey,
        },
      });
      if (userDid?.data?.error_code) {
        Logger.apiError(req, res, `${JSON.stringify(userDid.data)}`);
      }
      return res.status(200).send(userDid.data);
    } catch (e) {
      e.response
        ? res.status(400).json(e.response.data)
        : res.status(400).json(e);
    }
  },
  retrieveAllUsersDid: async function (req, res) {
    const { access_token } = req.cookies;
    const { companyName } = req.body;
    try {
      const undefinedVar = checkUndefinedVar({
        companyName,
      });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const usersDid = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/did/all",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
          params: {
            companyName,
          },
        }
      );
      if (usersDid?.data?.error_code) {
        Logger.apiError(req, res, `${JSON.stringify(userDid.data)}`);
      }
      let didDetails = [];
      for (let i = 0; i < usersDid?.data.length; i++) {
        let publicKey = usersDid.data[i].split(".did")[0];
        let usersDidDetail = await axios.get(
          SERVERS.DID_CONTROLLER + "/api/did",
          {
            withCredentials: true,
            headers: {
              Cookie: `access_token=${access_token};`,
            },
            params: {
              companyName,
              publicKey,
            },
          }
        );
        if (!usersDidDetail?.data?.error_code) {
          didDetails.push(usersDidDetail?.data);
        }
      }
      return res.status(200).send(didDetails);
    } catch (e) {
      console.log(e);
      e.response
        ? res.status(400).json(e.response.data)
        : res.status(400).json(e);
    }
  },
};
