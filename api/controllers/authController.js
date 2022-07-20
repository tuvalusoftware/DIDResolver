const axios = require("axios").default;
const Logger = require("../../logger");
const { ERRORS, SERVERS } = require("../../core/constants");
const { getPublicKeyFromAddress } = require("../../core/index");

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    Logger.apiInfo(
      req,
      res,
      `Authenticating access token ${req.cookies["access_token"]}`
    );

    if (!req.cookies["access_token"])
      return res.status(401).json(ERRORS.UNAUTHORIZED);

    const token = req.cookies["access_token"];
    // Call Auth Service
    // success:
    //   { data: { address: string } }
    // error: 401 - unauthorized
    axios
      .get(`${SERVERS.AUTHENTICATION_SERVICE}/api/auth/verify`, {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${token};`,
        },
      })
      .then(
        (response) => {
          var response = response.data;
          req.userData = {
            token,
            address: response.address,
          };
          next();
        },
        (error) => {
          console.log(error);
          next(error);
        }
      );
  },

  getPublicKeyFromAddress: (req, res) => {
    const { address, user } = req.query;
    Logger.apiInfo(req, res, `Get user publicKey form address ${address}.`);

    try {
      res.status(200).json({
        publicKey: getPublicKeyFromAddress(address),
        user: user,
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
