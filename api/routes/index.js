import authRoutes from "./authRoutes.js";
import didRoutes from "./didRoutes.js";
import wrappedDocRoutes from "./wrappedDocRoutes.js";
import accessTokenRoutes from "./accessTokenRoutes.js";
import pdfRoutes from "./pdfRoute.js";
import documentRoutes from "./documentRoutes.js";
import commonlandsRoutes from "./commonlandsRoute.js";
import signatureController from "../controllers/commonlands/signatureController.js";
import authController from "../controllers/cardano/authController.js";
import cardanoController from "../controllers/cardano/cardanoController.js";
import algorandController from "../controllers/algorand/algorandController.js";
import contractRoutes from "./contractRoutes.js";
import cmlCredentialRoutes from "./cmlCredentialRoutes.js";

export default (app) => {
  /**
   * Resolver API version 1 supported Cardano network
   */
  app.use("/resolver/commonlands/document", documentRoutes);
  app.use("/resolver/auth", authRoutes);
  app.use("/resolver/commonlands/plot", commonlandsRoutes);
  // DID controller services
  // app.use("/resolver/did", didRoutes);
  // app.use("/resolver/credential", credentialRoutes);
  app.use("/resolver/wrapped-document", wrappedDocRoutes);
  app.use("/resolver/credential", cmlCredentialRoutes);
  // PDF controller services
  app.use("/resolver/pdf", pdfRoutes);
  app.post("/resolver/signature", signatureController.signMessageBySeedPhrase);
  app.post("/resolver/account", signatureController.accountFromSeedPhrase);
  // Contract controller services
  app.use("/resolver/contract", contractRoutes);
  // app.get(
  //   "/resolver/nfts",
  //   authController.ensureAuthenticated,
  //   cardanoController.getNFTs
  // );
  // app.get(
  //   "/resolver/hash/verify",
  //   authController.ensureAuthenticated,
  //   cardanoController.verifyHash
  // );
  // app.get(
  //   "/resolver/signature/verify",
  //   authController.ensureAuthenticated,
  //   cardanoController.verifySignature
  // );

  /**
   * Resolver API version 2 supported both Cardano and Algorand networks
   */

  // Set token routes
  // app.use("/resolver", accessTokenRoutes);
  // app.get(
  //   "/resolver/nfts/v2",
  //   authController.ensureAuthenticated,
  //   algorandController.getNFTs
  // );
  // app.post(
  //   "/resolver/hash/verify/v2",
  //   authController.ensureAuthenticated,
  //   algorandController.verifyHash
  // );
  // app.post(
  //   "/resolver/signature/verify/v2",
  //   authController.ensureAuthenticated,
  //   algorandController.verifySignature
  // );
};
