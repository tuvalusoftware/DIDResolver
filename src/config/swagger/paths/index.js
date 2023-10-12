import {
    hashDocumentContent,
    commonlandsPlotCertificate,
    getDocumentInformation,
    addClaimantToDocument,
} from "./commonlands.js";
import { user } from "./user.js";
import { unsalt } from "./utility.js";

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
    "/user": {
        ...user,
    },
    "/utility/unsalt": {
        ...unsalt,
    },
};
