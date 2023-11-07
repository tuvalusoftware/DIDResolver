import http from "http";
import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./src/configs/swagger/index.js";
import routes from "./src/routers/routes/index.js";
import { ERRORS } from "./src/configs/errors/error.constants.js";
import {} from "./src/rabbit/index.js";
import { Logger } from "tslog";
import { ResolverConsumer } from "./src/rabbit/rabbit.consumer.js";
import connectMongo from "./src/libs/connectMongo.js";
import { env } from "./src/configs/constants.js";
import morgen from "morgan";

const logger = new Logger();

const app = express();
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

connectMongo();
await ResolverConsumer();

const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

/* c8 ignore start */
// SET UP SWAGGER API DOCUMENT
const swaggerOptions = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "DID Resolver API",
};
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptions)
);

const server = http.createServer(app);
server.timeout = 300000;
routes(app);
app.use(express.static("assets"));
app.use((err, req, res, _) => {
    try {
        if (err.code === "ECONNABORTED") {
            throw ERRORS.CONNECTION_TIMEOUT;
        }
        if (err.code === "ECONNREFUSED") {
            throw ERRORS.CONNECTION_REFUSED;
        }
        throw err;
    } catch (error) {
        process?.env?.NODE_ENV !== "test" && logger.error(error);
        return res.status(200).json({
            error_code: err.error_code,
            error_message:
                err.error_message || err?.message || "Something went wrong!",
            error_detail: err.detail || err.error_detail,
        });
    }
});

const port = normalizePort(env.NODE_PORT || "8000");
server.listen(port, () => {
    logger.debug(`Server is live on port ${port}: http://localhost:${port}/`);
});

export default server;
