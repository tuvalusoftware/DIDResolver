import express from "express";
import documentRoute from "./document.route.js";

export default (app) => {
    app.use("/api/v1/document", documentRoute);
    app.use(express.static("assets"));
};
