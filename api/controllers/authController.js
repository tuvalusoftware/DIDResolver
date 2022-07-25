const axios = require("axios").default;
const Logger = require("../../logger");
const { ERRORS, SERVERS } = require("../../core/constants");
const { getPublicKeyFromAddress, getAddressFromHexEncoded } = require("../../core/index");

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (!req.cookies["access_token"]) {
      Logger.apiError(req, res, `access_token not found`);
      return res.status(401).json(ERRORS.UNAUTHORIZED);
    }

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
          Logger.apiInfo(req, res, `Successfull authentication.`);
          var response = response.data;
          req.userData = {
            token,
            address: response.address,
          };
          next();
        },
        (error) => {
          next(error);
        }
      );
  },

  getPublicKeyFromAddress: (req, res) => {
    const { address, user } = req.query;
    try {
      const publicKey = getPublicKeyFromAddress(address);
      Logger.apiInfo(
        req,
        res,
        `User: ${user}, address: ${address}, publicKey: ${publicKey}.`
      );
      return res.status(200).json({
        publicKey: publicKey,
        user: user,
      });
    } catch (error) {
      Logger.apiError(req, res, error);
      return res.status(400).json(error);
    }
  },

  verifyToken: (req, res) => {
    if (!req.cookies["access_token"])
      return res.status(401).json(ERRORS.UNAUTHORIZED);
    const token = req.cookies["access_token"];
    axios
      .get(`${SERVERS.AUTHENTICATION_SERVICE}/api/auth/verify`, {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${token};`,
        },
      })
      .then(
        (response) => {
          res.status(200).json({
            address: getPublicKeyFromAddress(response?.data?.data?.address),
          });
        },
        (error) => {
          res.status(400).json(error);
        }
      );
  },
};
