const authRoutes = require("./authRoutes");
const didRoutes = require("./didRoutes");
const credentialRoutes = require("./credentialRoutes");
const wrappedDocRoutes = require("./wrappedDocRoutes");
const accessTokenRoutes = require("./accessTokenRoutes");

const authController = require("../controllers/cardano/authController");
const cardanoController = require("../controllers/cardano/cardanoController");
const algorandController = require("../controllers/algorand/algorandController");

module.exports = (app) => {
  /**
   * Resolver API version 1 supported Cardano network
   */
  app.use("/resolver/auth", authRoutes);

  // DID controller services
  app.use("/resolver/did", didRoutes);
  app.use("/resolver/credential", credentialRoutes);
  app.use("/resolver/wrapped-document", wrappedDocRoutes);

  // Cardano Routes
  // app.use("/resolver", cardanoRoutes);
  app.get(
    "/resolver/nfts",
    authController.ensureAuthenticated,
    cardanoController.getNFTs
  );
  app.get(
    "/resolver/hash/verify",
    authController.ensureAuthenticated,
    cardanoController.verifyHash
  );
  app.get(
    "/resolver/signature/verify",
    authController.ensureAuthenticated,
    cardanoController.verifySignature
  );

  /**
   * Resolver API version 2 supported both Cardano and Algorand networks
   */

  // Set token routes
  app.use("/resolver", accessTokenRoutes);
  app.get(
    "/resolver/nfts/v2",
    authController.ensureAuthenticated,
    algorandController.getNFTs
  );
  app.post(
    "/resolver/hash/verify/v2",
    authController.ensureAuthenticated,
    algorandController.verifyHash
  );
};
