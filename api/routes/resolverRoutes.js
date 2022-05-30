const res = require("express/lib/response");

module.exports = function(app) {
    var resolver = require("../controllers/resolverController");

    app.route("/resolver/did-document")
        .get(resolver.getDIDDocument)
        .post(resolver.createDIDDocument);
        
    app.route("/resolver/wrapped-document")
        .post(resolver.createWrappedDocument);

    app.route("/resolver/wrapped-document/exists")
        .get(resolver.checkDocExists);
}

