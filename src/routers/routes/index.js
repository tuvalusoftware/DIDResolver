import express from "express";
import documentRoute from "./document.route.js";
import didRoute from "./did.route.js";

export default (app) => {
    app.use("/api/v1/document", documentRoute);
    app.use("/api/v1/did", didRoute);
    app.use(express.static("assets"));
};
