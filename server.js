import http from "http";
import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import logger from "./logger.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./src/config/swagger/index.js";
import routes from "./src/api/routes/index.js";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(methodOverride());
app.use(
  express.urlencoded({
    extended: true,
  })
);

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
app.use((err, req, res, _) => {
  logger.apiError(
    req,
    res,
    `Error in ${req.method} ${req.url}: ${err?.error_message}`
  );
  return res.status(200).json({
    error_code: err.error_code,
    error_message: err.error_message || err?.message || "Something went wrong!",
    error_detail: err.detail || err.error_detail,
  });
});

const port = normalizePort(process.env.NODE_PORT || "8000");
server.listen(port, () => {
  logger.info(`Server is live on port ${port}: http://localhost:${port}/`);
});

export default server;
