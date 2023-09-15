import http from "http";
import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import logger from "./logger.js";
const app = express();

// // App configurations
// const corsOptions = {
//   origin: [
//     "http://18.139.84.180:11000",
//     "https://paperless-fuixlabs.ap.ngrok.io",
//     "http://localhost:4000",
//   ],
//   credentials: true,
// };
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride());

/* c8 ignore start */
// SET UP SWAGGER API DOCUMENT
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger/index.js";
const swaggerOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "DID Resolver API",
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);
/* c8 ignore stop */

// ROUTES
const server = http.createServer(app);
server.timeout = 300000;
import routes from "./api/routes/index.js";
routes(app);

app.use((err, req, res, _) => {
  logger.apiError(req, res, `Error: ${JSON.stringify(err)}`);
  return res.status(200).json({
    error_code: err.error_code,
    error_message: err.error_message || err?.message || "Something went wrong!",
    detail: err.detail,
  });
});

const port = process.env.NODE_PORT || 8000;
server.listen(port, () => {
  logger.info(`Server is live on port ${port}: http://localhost:${port}/`);
});

export default server;
