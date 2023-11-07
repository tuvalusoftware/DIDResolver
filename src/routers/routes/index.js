import documentRoutes from "./v1/documentRoutes.js";
import contractRoutes from "./v1/contractRoutes.js";
import utilityRoutes from "./v1/utilityRoutes.js";
import verifierRoutes from "./v1/verifierRoutes.js";

import documentRouteV2 from "./v2/documentRoutes.js";
import contractRouteV2 from "./v2/contractRoutes.js";

import express from "express";

export default (app) => {
    app.use("/resolver/commonlands/document", documentRoutes);
    app.use("/resolver/contract", contractRoutes);
    app.use("/resolver/utility", utilityRoutes);
    app.use("/resolver/verify", verifierRoutes);

    app.use("/resolver/v2/contract", contractRouteV2);
    app.use("/resolver/v2/commonlands/document", documentRouteV2);
    app.use(express.static("assets"));
};
