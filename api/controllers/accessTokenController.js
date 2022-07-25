const Logger = require("../../logger");

module.exports = {
  setCookie: async (req, res, next) => {
    const { access_token } = req.headers;
    res.cookie("access_token", access_token);
    res.send("Set Cookie Successfully.");
    Logger.apiInfo(req, res, `Set cookie: access_token=${access_token}.`);
  },

  clearCookie: async (req, res, next) => {
    res.clearCookie("access_token");
    res.send("Clear Cookie Successfully.");
    Logger.apiInfo(req, res, `Clear cookie.`);
  },
};
