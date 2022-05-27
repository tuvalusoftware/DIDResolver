const tags = require("./tags");
const { definitions } = require("./definitions");
const { getDidDocument } = require("./getDidDocument");
const { postDidDocument } = require("./postDidDocument");

module.exports = {
    swagger: "2.0",
    info: {
        version: "1.0.0",
        title: "DID Resolver",
        description: "DID resolver for Cardano project | Fuixlabs"
    },
    host: "localhost:8000",
    basePath: "/resolver",
    schemes: ["http"],
    ...tags,
    definitions: {
        ...definitions
    },
    paths: {
        "/did-document/": {
            ...getDidDocument,
            ...postDidDocument,
        },
        "/wrapped-document/": {

        }
    }
    // ...{ paths: paths },
}