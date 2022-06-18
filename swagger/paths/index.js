const { getDidDocument, createDidDocument } = require("./didDocument");
const { checkWrappedDocumentExistence, getWrappedDocument, createWrappedDocument } = require("./wrappedDocument");

module.exports.paths = {
    "/did-document/": {
        ...getDidDocument,
        ...createDidDocument,
    },

    "/wrapped-document/": {
        ...getWrappedDocument,
        ...createWrappedDocument
    },
    "/wrapped-document/exists/": {
        ...checkWrappedDocumentExistence
    },

    // "/nfts/": {

    // },
    // "/hash/verify/": {
    // },
    // "/signature/verify/": {
    // }
}