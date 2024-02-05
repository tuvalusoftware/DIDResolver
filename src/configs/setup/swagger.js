import { swaggerDocument } from "../swagger/index.js";
import swaggerUi from "swagger-ui-express";

export const setUpSwagger = (app) => {
    const swaggerOptions = {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "DID Resolver API",
    };
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, swaggerOptions)
    );
};
