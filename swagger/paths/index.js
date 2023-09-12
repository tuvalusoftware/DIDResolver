import { setCookie, clearCookie } from "./accessToken.js";
import { getPublicKeyFromAddress } from "./auth.js";
import { createCredential } from "./credential.js";
import { getNFTs, verifyHash, verifySignature } from "./others.js";
import {
  checkWrappedDocumentExistence,
  getWrappedDocument,
  createWrappedDocument,
  getAllWrappedDocumentsOfUser,
  validateWrappedDocument,
  searchWrappedDocument,
  transferWrappedDocument,
  revokeWrappedDocument,
} from "./wrappedDocument.js";
import { retrieveSpecificDid, retrieveAllDids } from "./did.js";

import {
  createAlgorandCredential,
  algorandDocument,
  getAlgorandNFTs,
  verifyAlgorandHash,
  verifyAlgorandSignature,
  verifyAlgorandAddress,
} from "./algorand.js";
import {
  commonlandsDocument,
  commonlandsPdf,
  verifyCommonlandsPdf,
  revokeCommonlandsDocument,
  multipleCommonlandsDocumentSigning,
  hashDocumentContent,
  verifyUploadedCommonlandsPdf,
  commonlandsCredential,
} from "./commonlands.js";
import { contract, verifyContract } from "./contract.js";

export const paths = {
  // * Commonlands
  "/commonlands/document": {
    ...commonlandsDocument,
  },
  "/commonlands/document/testing": {
    ...commonlandsDocument,
  },
  "/commonlands/document/revoke": {
    ...revokeCommonlandsDocument,
  },
  "/contract": {
    ...contract,
  },
  "/contract/verify": {
    ...verifyContract,
  },
  "/commonlands/document/multiple": {
    ...multipleCommonlandsDocumentSigning,
  },
  "/commonlands/document/hash": {
    ...hashDocumentContent,
  },
  "/credential": {
    ...commonlandsCredential,
  },
  "/pdf": {
    ...commonlandsPdf,
  },
  "/pdf/verify": {
    ...verifyCommonlandsPdf,
  },
  "/pdf/upload-verify": {
    ...verifyUploadedCommonlandsPdf,
  },
  "/": {
    ...setCookie,
    ...clearCookie,
  },
  // "/did/": {
  //   ...retrieveSpecificDid,
  // },
  // "/did/all/": {
  //   ...retrieveAllDids,
  // },
  // "/auth/public-key/": {
  //   ...getPublicKeyFromAddress,
  // },
  // "/auth/public-key/v2": {
  //   ...verifyAlgorandAddress,
  // },

  // "/wrapped-document/": {
  //   ...getWrappedDocument,
  //   ...createWrappedDocument,
  // },
  // "/wrapped-document/exist/": {
  //   ...checkWrappedDocumentExistence,
  // },
  // "/wrapped-document/valid/": {
  //   ...validateWrappedDocument,
  // },
  // "/wrapped-document/user": {
  //   ...getAllWrappedDocumentsOfUser,
  // },
  // "/wrapped-document/transfer": {
  //   ...transferWrappedDocument,
  // },
  // "/wrapped-document/search": {
  //   ...searchWrappedDocument,
  // },
  // "/wrapped-document/revoke": {
  //   ...revokeWrappedDocument,
  // },

  // "/credential/": {
  //   ...createCredential,
  // },

  // "/nfts/": {
  //   ...getNFTs,
  // },
  // "/hash/verify/": {
  //   ...verifyHash,
  // },
  // "/signature/verify/": {
  //   ...verifySignature,
  // },

  // // * Algorand
  // "/credential/v2/": {
  //   ...createAlgorandCredential,
  // },
  // "/nfts/v2/": {
  //   ...getAlgorandNFTs,
  // },
  // "/signature/verify/v2/": {
  //   ...verifyAlgorandSignature,
  // },
  // "/hash/verify/v2/": {
  //   ...verifyAlgorandHash,
  // },
  // "/wrapped-document/v2/": {
  //   ...algorandDocument,
  // }
};
