import {
  commonlandsDocument,
  commonlandsPdf,
  verifyCommonlandsPdf,
  revokeCommonlandsDocument,
  hashDocumentContent,
  verifyUploadedCommonlandsPdf,
  commonlandsCredential,
  commonlandsPlotCertificate,
  getEndorsementChainOfCertificate,
  checkLastestVersion,
  verifyCertificateQrcode,
  getDocumentInformation,
} from "./commonlands.js";
import {
  contract,
  verifyContract,
  assignCredentialToContract,
  checkLockedStatus,
} from "./contract.js";
import { getAllCredentialsOfContract, getCredential } from "./credential.js";
import { user } from "./user.js";
import { unsalt } from "./utility.js";

export const paths = {
  // "/commonlands/document": {
  //   ...commonlandsDocument,
  // },
  "/commonlands/document/{did}": {
    ...getDocumentInformation,
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
  // "/commonlands/document/revoke": {
  //   ...revokeCommonlandsDocument,
  // },
  "/commonlands/document/hash": {
    ...hashDocumentContent,
  },
  // "/commonlands/document/endorsement/{did}": {
  //   ...getEndorsementChainOfCertificate,
  // },
  // "/credential": {
  //   ...commonlandsCredential,
  // },
  // "/credential/{credentialHash}": {
  //   ...getCredential,
  // },
  // "/credential/all/{contractId}": {
  //   ...getAllCredentialsOfContract,
  // },
  // "/pdf": {
  //   ...commonlandsPdf,
  // },
  // "/pdf/verify": {
  //   ...verifyCommonlandsPdf,
  // },
  // "/pdf/upload-verify": {
  //   ...verifyUploadedCommonlandsPdf,
  // },
  // "/contract": {
  //   ...contract,
  // },
  // "/contract/lock-contract": {
  //   ...assignCredentialToContract,
  // },
  // "/contract/isLocked": {
  //   ...checkLockedStatus,
  // },
  // "/contract/verify": {
  //   ...verifyContract,
  // },
  // "/user": {
  //   ...user,
  // },
  // "/utility/unsalt": {
  //   ...unsalt,
  // },
};
