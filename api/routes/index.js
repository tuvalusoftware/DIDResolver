const documentRoutes = require("./documentRoutes");
const cardanoRoutes = require("./cardanoRoutes");
const credentialRoutes = require("./credentialRoutes");
const notiRoutes = require("./notiRoutes");
const authRoutes = require("./authRoutes");
const accessTokenRoutes = require("./accessTokenRoutes");
const didRoutes = require('./didRoutes');

module.exports = (app) => {
  app.use("/resolver", accessTokenRoutes);
  app.use("/resolver", documentRoutes);
  app.use("/resolver", cardanoRoutes);
  app.use("/resolver", credentialRoutes);
  app.use("/resolver", authRoutes);
  app.use("/resolver", notiRoutes);
  app.use('/resolver', didRoutes);
};
