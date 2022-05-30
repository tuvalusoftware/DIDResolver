var express = require("express"),
  cors = require("cors"),
  app = express(),
  port = process.env.PORT || 9000,
  bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json()); 
app.use(cors());
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "http://192.168.1.20:4000");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, ConAccept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
  });

// routes
var routes = require("./api/routes/resolverRoutes");
routes(app);

app.listen(port);

console.log("DID Resolver RESTfull API server start on: " + port);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + " not found"});
});
