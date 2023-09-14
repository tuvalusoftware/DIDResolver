import { setCookie, clearCookie } from "./accessToken.js";
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
import {
  contract,
  verifyContract,
  checkBlockStatus,
  blockContract,
} from "./contract.js";

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
  "/contract": {
    ...contract,
  },
  "/contract/verify": {
    ...verifyContract,
  },
  "contract/block": {
    ...blockContract,
  },
  "contract/check-block": {
    ...checkBlockStatus,
  },
  "/": {
    ...setCookie,
    ...clearCookie,
  },
};
