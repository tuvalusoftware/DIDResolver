const definitions = require("./definitions"),
 tags = require("./tags");
const didDocument = require("./didDocument");

const paths = {
    ...didDocument
}

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
    ...definitions,
    ...{ paths: paths },
}