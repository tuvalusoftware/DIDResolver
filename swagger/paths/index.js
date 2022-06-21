const { getDidDocument, createDidDocument } = require("./didDocument");
const { getNFTs, verifyHash, verifySignature } = require("./others");
const { checkWrappedDocumentExistence, getWrappedDocument, createWrappedDocument, getAllWrappedDocumentsOfUser, validateWrappedDocument } = require("./wrappedDocument");

module.exports.paths = {
  "/did-document/": {
    ...getDidDocument,
    ...createDidDocument,
  },

  "/wrapped-document/": {
    ...getWrappedDocument,
    ...createWrappedDocument
  },
  "/wrapped-document/exist/": {
    ...checkWrappedDocumentExistence
  },
  "/wrapped-document/valid/": {
    ...validateWrappedDocument
  },
  "/wrapped-document/user": {
    ...getAllWrappedDocumentsOfUser
  },

  "/nfts/": {
    ...getNFTs
  },
  "/hash/verify/": {
    ...verifyHash
  },
  "/signature/verify/": {
    ...verifySignature
  }
}