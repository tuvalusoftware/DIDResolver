const axios = require("axios").default;
const Logger = require("../../../logger");
const { ERRORS, SERVERS } = require("../../../core/constants");

module.exports = {
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
      Logger.apiError(req, res, `${JSON.stringify(error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
};
