var express = require("express"),
  app = express(),
  port = process.env.PORT || 2000,
  bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
var routes = require("./api/routes/resolverRoutes");
routes(app);

app.listen(port);

console.log("DID Resolver RESTfull API server start on: " + port);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + " not found"});
});
