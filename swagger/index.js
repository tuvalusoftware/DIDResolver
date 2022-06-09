const tags = require("./tags");
const { schemas, examples } = require("./components");
const { getDidDocument, createDidDocument } = require("./didDocument");
const { checkWrappedDocumentExistence } = require("./wrappedDocument");
const { getDocument } = require("./document");
const { verifyHash, verifySignature } = require("./verify");

module.exports = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "DID Resolver",
        description: "DID resolver for Cardano project | Fuixlabs"
    },
    servers: [
        {
            url: "/resolver",
            description: "Local server",
        },
    ],
    // host: "18.139.84.180:8000",
    // basePath: "/resolver",
    schemes: ["http"],
    ...tags,
    components: {
        schemas: {
            ...schemas
        },
        examples: {
            ...examples
        }
    },
    paths: {
        "/did-document/": {
            ...getDidDocument,
            ...createDidDocument,
        },
        "/wrapped-document/": {
        },
        "/wrapped-document/exists/": {
            ...checkWrappedDocumentExistence
        },
        "/document/": {
            ...getDocument
        },
        "/nfts/": {

        },
        "/verify/hash/": {
            ...verifyHash
        },
        "/verify/signature/": {
            ...verifySignature
        }
    }
    // ...{ paths: paths },
}