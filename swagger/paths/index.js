const { getDidDocument, createDidDocument } = require("./didDocument");
const { getNFTs } = require("./others");
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
  // "/wrapped-document/valid/": {

  // },

  "/nfts/": {
    ...getNFTs
  },
  // "/hash/verify/": {
  // },
  // "/signature/verify/": {
  // }
}