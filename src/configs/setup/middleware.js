import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import morgen from "morgan";

export const setUpMiddleware = async (app) => {
    try {
        app.use(cors());
        app.use(cookieParser());
        app.use(compression());
        app.use(express.json({ limit: "200mb" }));
        app.use(express.urlencoded({ limit: "200mb", extended: true }));
        app.use(methodOverride());
        app.use(morgen("tiny"));
        app.use(
            express.urlencoded({
                extended: true,
            })
        );
    } catch (error) {
        throw error;
    }
};
