import express from "express";
import routes from "../../routers/routes/index.js";

export const setUpRoute = (app) => {
    routes(app);
    app.use(express.static("assets"));
};
