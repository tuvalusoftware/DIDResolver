const { getPublicKeyFromAddress } = require("./auth");
const { createCredential } = require("./credential");
const { getDidDocument, createDidDocument } = require("./didDocument");
const { createNotification } = require("./noti");
const { getNFTs, verifyHash, verifySignature } = require("./others");
const {
  checkWrappedDocumentExistence,
  getWrappedDocument,
  createWrappedDocument,
  getAllWrappedDocumentsOfUser,
  validateWrappedDocument,
  updateWrappedDocument,
} = require("./wrappedDocument");

module.exports.paths = {
  "auth/public-key/": {
    ...getPublicKeyFromAddress,
  },

  "/did-document/": {
    ...getDidDocument,
    ...createDidDocument,
  },

  "/wrapped-document/": {
    ...getWrappedDocument,
    ...createWrappedDocument,
    // ...updateWrappedDocument
  },
  "/wrapped-document/exist/": {
    ...checkWrappedDocumentExistence,
  },
  "/wrapped-document/valid/": {
    ...validateWrappedDocument,
  },
  "/wrapped-document/user": {
    ...getAllWrappedDocumentsOfUser,
  },

  "/credential/": {
    ...createCredential,
  },

  "/noti": {
    ...createNotification,
  },

  "/nfts/": {
    ...getNFTs,
  },
  "/hash/verify/": {
    ...verifyHash,
  },
  "/signature/verify/": {
    ...verifySignature,
  },
};
