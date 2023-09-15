import authRoutes from "./authRoutes.js";
import wrappedDocRoutes from "./wrappedDocRoutes.js";
import pdfRoutes from "./pdfRoute.js";
import documentRoutes from "./documentRoutes.js";
import contractRoutes from "./contractRoutes.js";
import cmlCredentialRoutes from "./cmlCredentialRoutes.js";
import userRoutes from "./userRoutes.js";

export default (app) => {
  app.use("/resolver/commonlands/document", documentRoutes);
  app.use("/resolver/auth", authRoutes);
  app.use("/resolver/wrapped-document", wrappedDocRoutes);
  app.use("/resolver/credential", cmlCredentialRoutes);
  app.use("/resolver/pdf", pdfRoutes);
  app.use("/resolver/contract", contractRoutes);
  app.use("/resolver/user", userRoutes);
  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });
};
