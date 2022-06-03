const http = require("http"),
  express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  compression = require("compression"),
  methodOverride = require("method-override");
swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger/"),
  port = process.env.PORT || 8000;

const app = express();

// routes
const routes = require("./api/routes/resolverRoutes");
routes(app);

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = http.createServer(app);

app.use((err, res) => {
  res.json({
    error_code: err.error_code || err.message,
    error_message: err.message,
    error_data: err.error_data,
  });
});
server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});