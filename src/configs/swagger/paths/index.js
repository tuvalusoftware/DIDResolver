import {
    hashDocumentContent,
    commonlandsPlotCertificate,
    getDocumentInformation,
    addClaimantToDocument,
    commonlandsPlotCertificateV2,
    addClaimantToDocumentV2,
} from "./commonlands.js";
import { user } from "./user.js";
import { unsalt } from "./utility.js";
import { certificateVerifier, credentialVerifier } from "./verifier.js";
import { contract, signContract, getContract } from "./contract.js";

export const paths = {
    "/commonlands/document/{did}": {
        ...getDocumentInformation,
    },
    "/commonlands/document/certificate": {
        ...commonlandsPlotCertificate,
    },
    "/v2/commonlands/document/certificate": {
        ...commonlandsPlotCertificateV2,
    },
    "/commonlands/document/certificate/add-claimant": {
        ...addClaimantToDocument,
    },
    "/v2/commonlands/document/certificate/add-claimant": {
        ...addClaimantToDocumentV2,
    },
    "/commonlands/document/hash": {
        ...hashDocumentContent,
    },
    "/contract": {
        ...contract,
    },
    "/contract/{did}": {
        ...getContract,
    },
    "/contract/sign": {
        ...signContract,
    },
    "/verify/certificate": {
        ...certificateVerifier,
    },
    "/verify/credential": {
        ...credentialVerifier,
    },
    "/user": {
        ...user,
    },
    "/utility/unsalt": {
        ...unsalt,
    },
};
