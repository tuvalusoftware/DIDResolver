import {
    hashDocumentContent,
    commonlandsPlotCertificate,
    getDocumentInformation,
    addClaimantToDocument,
} from "./commonlands";
import { user } from "./user";
import { unsalt } from "./utility";
import { certificateVerifier, credentialVerifier } from "./verifier";
import { contract, signContract, getContract } from "./contract";

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
