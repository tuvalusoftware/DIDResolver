var express = require("express"),
  app = express(),
  port = process.env.PORT || 8000,
  bodyParser = require("body-parser");

var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger/");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
var routes = require("./api/routes/resolverRoutes");
routes(app);

app.listen(port);

console.log("DID Resolver RESTfull API server start on: " + port);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + " not found"});
});
