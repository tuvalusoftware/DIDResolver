const axios = require("axios").default;
const { checkUndefinedVar } = require("../../../core");
const { ERRORS, SERVERS } = require("../../../core/constants");
const { apiError, apiInfo } = require("../../../logger");

axios.defaults.withCredentials = true;

module.exports = {
  getNFTs: async function (req, res) {
    const { access_token } = req.cookies;
    const { unitName, assetId } = req.query;
    try {
      const fetchNFTsResponse = await axios.post(
        `${SERVERS.ALGORAND_SERVICE}/api/v1/fetch/nft`,
        {
          unitName,
          assetId: assetId || undefined,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      );
      if (fetchNFTsResponse?.data?.code !== 0) {
        apiError(req, res, `${JSON.stringify(fetchNFTsResponse.data)}`);
        return res.status(200).json(ERRORS.CANNOT_FETCH_NFT);
      }
      apiInfo(req, res, `Success.\n${JSON.stringify(fetchNFTsResponse.data)}`);
      return res.status(200).json(fetchNFTsResponse?.data?.data);
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
  verifyHash: async function (req, res) {
    const { access_token } = req.cookies;
    const { assetId } = req.body;
    try {
      const undefinedVar = checkUndefinedVar({ assetId });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const verifyHashResponse = await axios.post(
        `${SERVERS.ALGORAND_SERVICE}/api/v1/fetch/nft`,
        {
          assetId,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      );
      if (
        verifyHashResponse?.data?.code !== 0
      ) {
        apiError(req, res, `${JSON.stringify(verifyHashResponse.data)}`);
        return res.status(200).json(ERRORS.CANNOT_FETCH_NFT);
      }
      apiInfo(req, res, `Success.\n${JSON.stringify(verifyHashResponse.data)}`);
      if (
        verifyHashResponse?.data?.data?.assets.length > 0 &&
        verifyHashResponse?.data?.data?.assets[0]["index"] === parseInt(assetId)
      ) {
        apiInfo(req, res, `Transaction with asset-id = ${assetId} is valid!`);
        return res.status(200).json({
          isValid: true,
        });
      }
      apiError(req, res, `Transaction with asset-id = ${assetId} is invalid!`);
      return res.status(200).json({
        isValid: false,
      });
    } catch (e) {
      apiError(req, res, `${JSON.stringify(e)}`);
      return e.response
        ? res.status(400).json(e.response.data)
        : res.status(400).json(e);
    }
  },
  verifySignature: async function (req, res) {
    const { access_token } = req.cookies;
    const { address, payload, signature } = req.body;
    try {
      const undefinedVar = checkUndefinedVar({
        address,
        payload,
        signature,
      });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const verifySignatureResponse = await axios.post(
        SERVERS.ALGORAND_SERVICE + "/api/v1/verify/signature",
        {
          address: address,
          payload: payload,
          signature: signature,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      );
      if (verifySignatureResponse?.data?.code === 0) {
        apiInfo(req, res, `Signature is valid!`);
        return res.status(200).json({
          isValid: true,
        });
      }
      apiError(req, res, `Signature is invalid!`);
      return res.status(200).json({
        isValid: false,
      });
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
};
