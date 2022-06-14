module.exports = function (app) {
    var resolver = require("../controllers/resolverController");

    app.route("/resolver/did-document")
        .get(resolver.getDIDDocument)
        .post(resolver.createDIDDocument);

    app.route("/resolver/wrapped-document")
        .post(resolver.createWrappedDocument)
        .get(resolver.validateWrappedDocument);

    app.route("/resolver/wrapped-document/exists")
        .get(resolver.checkWrappedDocumentExistence);

    app.route("/resolver/document")
        .get(resolver.getDocuments);

    app.route('/resolver/nfts')
        .get(resolver.getNfts);

    app.route('/resolver/verify/hash')
        .get(resolver.verifyHash);

    app.route("/resolver/verify/signature")
        .get(resolver.verifySignature);

    app.route("/resolver/wrapped-document/valid")
        .get(resolver.checkWrappedDocumentValidity)
}

