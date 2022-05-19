const axios = require("axios").default;

module.exports = function(app) {
    var resolver = require("../controllers/resolverController");

    app.route("/resolver/did")
        .get(resolver.getDIDDocument);
    app.route("/resolver/wrapped-document")
        .post(resolver.createWrappedDocument);
}

