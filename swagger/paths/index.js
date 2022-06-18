const { getDidDocument, createDidDocument } = require("./didDocument");
const { checkWrappedDocumentExistence } = require("./wrappedDocument");
const { getDocument } = require("./document");


module.exports.paths = {
    "/did-document/": {
        ...getDidDocument,
        ...createDidDocument,
    },
    // "/wrapped-document/": {
    // },
    // "/wrapped-document/exists/": {
    //     ...checkWrappedDocumentExistence
    // },
    // "/document/": {
    //     ...getDocument
    // },
    // "/nfts/": {

    // },
    // "/hash/verify/": {
    // },
    // "/signature/verify/": {
    // }
}