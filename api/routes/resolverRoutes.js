const axios = require("axios").default;

module.exports = function(app) {
    var resolver = require("../controllers/resolverController");

    app.route("/resolver/")
        .get(resolver.getDIDDocument)
        .post(resolver.createWrappedDocument);
}

