import documentRoutes from "./documentRoutes.js";
import contractRoutes from "./contractRoutes.js";
import utilityRoutes from "./utilityRoutes.js";
import taskQueueRoutes from "./taskQueueRoutes.js";
import express from "express";

export default (app) => {
    app.use("/resolver/commonlands/document", documentRoutes);
    app.use("/resolver/contract", contractRoutes);
    app.use("/resolver/utility", utilityRoutes);
    app.use("/resolver/task-queue", taskQueueRoutes);
    app.use(express.static("assets"));

  // app.get("*", (req, res) => {
  //   res.status(404).send("Not found");
  // });
};
