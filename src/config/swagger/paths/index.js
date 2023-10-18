import {
    hashDocumentContent,
    commonlandsPlotCertificate,
    getDocumentInformation,
    addClaimantToDocument,
} from "./commonlands.js";
import { user } from "./user.js";
import { unsalt } from "./utility.js";
import { certificateVerifier, credentialVerifier } from "./verifier.js";
import { contract, signContract } from "./contract.js";

export const paths = {
    "/commonlands/document/{did}": {
        ...getDocumentInformation,
    },
    "/commonlands/document/certificate": {
        ...commonlandsPlotCertificate,
    },
    "/commonlands/document/certificate/add-claimant": {
        ...addClaimantToDocument,
    },
    "/commonlands/document/hash": {
        ...hashDocumentContent,
    },
    "/contract": {
        ...contract,
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
