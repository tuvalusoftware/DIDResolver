const axios = require("axios").default;
const { ERRORS, SERVERS } = require("../../core/constants");

module.exports = {
  setCookie: async (req, res, next) => {
    const { accessToken } = req.headers;
    res.cookie("access_token", accessToken);
    res.send("Set Cookie Successfully.");
  },

  clearCookie: async (req, res, next) => {
    res.clearCookie("access_token");
    res.send("Clear Cookie Successfully.");
  },
};
