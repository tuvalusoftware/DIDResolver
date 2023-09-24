import { setCookie, clearCookie } from "./accessToken.js";
import {
  commonlandsDocument,
  commonlandsPdf,
  verifyCommonlandsPdf,
  revokeCommonlandsDocument,
  hashDocumentContent,
  verifyUploadedCommonlandsPdf,
  commonlandsCredential,
  blockDocument,
  checkDocumentBlockStatus,
  commonlandsPlotCertificate,
  getEndorsementChainOfCertificate,
  checkLastestVersion,
  verifyCertificateQrcode,
} from "./commonlands.js";
import {
  contract,
  verifyContract,
  checkBlockStatus,
  blockContract,
} from "./contract.js";
import { getAllCredentialsOfContract, getCredential } from "./credential.js";
import { user } from "./user.js";

export const paths = {
  "/commonlands/document": {
    ...commonlandsDocument,
  },
  "/commonlands/document/plot-certificate": {
    ...commonlandsPlotCertificate,
  },
  "/commonlands/document/lastest-version": {
    ...checkLastestVersion,
  },
  "/commonlands/document/qrcode-verify": {
    ...verifyCertificateQrcode,
  },
  "/commonlands/document/revoke": {
    ...revokeCommonlandsDocument,
  },
  "/commonlands/document/hash": {
    ...hashDocumentContent,
  },
  "/commonlands/document/block": {
    ...blockDocument,
  },
  "/commonlands/document/check-block": {
    ...checkDocumentBlockStatus,
  },
  "/commonlands/document/endorsement/{did}": {
    ...getEndorsementChainOfCertificate,
  },
  "/credential": {
    ...commonlandsCredential,
  },
  "/credential/{credentialHash}": {
    ...getCredential,
  },
  "/credential/all/{contractId}": {
    ...getAllCredentialsOfContract,
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
  "/contract/block": {
    ...blockContract,
  },
  "/contract/check-block": {
    ...checkBlockStatus,
  },
  "/user": {
    ...user,
  },
  "/": {
    ...setCookie,
    ...clearCookie,
  },
};
