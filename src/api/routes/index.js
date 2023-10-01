import pdfRoutes from "./pdfRoute.js";
import documentRoutes from "./documentRoutes.js";
import contractRoutes from "./contractRoutes.js";
import cmlCredentialRoutes from "./cmlCredentialRoutes.js";
import userRoutes from "./userRoutes.js";
import utilityRoutes from "./utilityRoutes.js";
import taskQueueRoutes from "./taskQueueRoutes.js";

export default (app) => {
  app.use("/resolver/commonlands/document", documentRoutes);
  app.use("/resolver/credential", cmlCredentialRoutes);
  app.use("/resolver/pdf", pdfRoutes);
  app.use("/resolver/contract", contractRoutes);
  app.use("/resolver/user", userRoutes);
  app.use("/resolver/utility", utilityRoutes);
  app.use("/resolver/task-queue", taskQueueRoutes)

  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });
};
