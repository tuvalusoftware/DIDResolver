const { createCredential } = require("./credential");
const { getDidDocument, createDidDocument } = require("./didDocument");
const { getNFTs, verifyHash, verifySignature } = require("./others");
const { checkWrappedDocumentExistence, getWrappedDocument, createWrappedDocument, getAllWrappedDocumentsOfUser, validateWrappedDocument, updateWrappedDocument } = require("./wrappedDocument");

module.exports.paths = {
  "/did-document/": {
    ...getDidDocument,
    ...createDidDocument,
  },

  "/wrapped-document/": {
    ...getWrappedDocument,
    ...createWrappedDocument,
    ...updateWrappedDocument
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

  "/credential/": {
    ...createCredential
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