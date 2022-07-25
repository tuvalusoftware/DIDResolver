const axios = require("axios").default;
const { ERRORS, SERVERS } = require("../../core/constants");
const { getPublicKeyFromAddress, getAddressFromHexEncoded } = require("../../core/index");

module.exports = {
  ensureAuthenticated: (req, res, next) => {
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
          next(error);
        }
      );
  },

  getPublicKeyFromAddress: (req, res) => {
    const { address, user } = req.query;
    try {
      res.status(200).json({
        publicKey: getPublicKeyFromAddress(address),
        user: user,
      });
    } catch (error) {
      res.status(400).json(error);
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
