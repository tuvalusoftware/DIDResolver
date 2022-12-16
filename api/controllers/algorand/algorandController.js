const axios = require("axios").default;
const { checkUndefinedVar } = require("../../../core");
const { ERRORS, SERVERS, SCHEMAS } = require("../../../core/constants");
const { apiError, apiInfo } = require("../../../logger");

axios.defaults.withCredentials = true;

module.exports = {
  getNFTs: async function (req, res) {
    const { access_token } = req.cookies;
    const { unitName } = req.query;
    try {
      const undefinedVar = checkUndefinedVar({ unitName });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const fetchNFTsResponse = await axios.post(
        `${SERVERS.ALGORAND_SERVICE}/api/v1/fetch/nft`,
        {
          unitName,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      );
      if (
        fetchNFTsResponse &&
        fetchNFTsResponse.data &&
        fetchNFTsResponse.data.code !== 0
      ) {
        apiError(req, res, `${JSON.stringify(fetchNFTsResponse.data)}`);
        return res.status(200).json(ERRORS.CANNOT_FETCH_NFT);
      }
      apiInfo(req, res, `Success.\n${JSON.stringify(fetchNFTsResponse.data)}`);
      return res.status(200).json(fetchNFTsResponse.data.data);
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
};
