import { tags } from "./tags.js";
import { paths } from "./paths/index.js";

export const swaggerDocument = {
    openapi: "3.1.0",
    info: {
        version: "v1.0",
        title: "DOMINIUM Service",
        description: "DOMINIUM Service API Documentation",
    },
    servers: [
        {
            url: "/api",
            description: "Local server",
        },
    ],
    tags: tags,
    paths: paths,
};
