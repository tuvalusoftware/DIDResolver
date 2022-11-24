const { setCookie, clearCookie } = require("./accessToken");
const { getPublicKeyFromAddress } = require("./auth");
const { createCredential } = require("./credential");
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
const { retrieveSpecificDid, retrieveAllDids } = require("./did");

module.exports.paths = {
    "/": {
        ...setCookie,
        ...clearCookie,
    },
    "/did/": {
        ...retrieveSpecificDid,
    },
    "/did/all/": {
        ...retrieveAllDids,
    },
    "/auth/public-key/": {
        ...getPublicKeyFromAddress,
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
