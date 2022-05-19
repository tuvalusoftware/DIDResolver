const req = require("express/lib/request");
// const fileupload = require("express-fileupload");

var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(fileupload());

var routes = require("./api/routes/resolverRoutes");
routes(app);

app.listen(port);

console.log("DID Resolver RESTfull API server start on: " + port);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + " not found"});
});
