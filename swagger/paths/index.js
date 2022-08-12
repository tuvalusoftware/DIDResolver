const { setCookie, clearCookie } = require("./accessToken");
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
  searchWrappedDocument,
  transferWrappedDocument,
  revokeWrappedDocument,
} = require("./wrappedDocument");

module.exports.paths = {
  "/": {
    ...setCookie,
    ...clearCookie,
  },

  "/auth/public-key/": {
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
  "/wrapped-document/transfer": {
    ...transferWrappedDocument,
  },
  "/wrapped-document/search": {
    ...searchWrappedDocument,
  },
  "/wrapped-document/revoke": {
    ...revokeWrappedDocument,
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
