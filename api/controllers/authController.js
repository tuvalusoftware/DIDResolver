const axios = require("axios").default;
const { ERRORS, SERVERS } = require("../../core/constants");

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (!req.cookies["access_token"]) return res.status(401).json(ERRORS.UNAUTHORIZED);
    const token = req.cookies["access_token"];
    axios
      .get(
        `${SERVERS.AUTHENTICATION_SERVICE}/api/auth/verify`,
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${token};`,
          },
        }
      )
      .then((response) => {
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
  }
};