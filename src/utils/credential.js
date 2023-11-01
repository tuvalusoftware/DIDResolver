// * Utilities
import { sha256 } from "js-sha256";
import { generateRandomDID } from "./index.js";
import { setUpSuite } from "../utils/verifiableCredential.js";

// * Constants
import { COMPANY_NAME } from "../configs/constants.js";
import { generateDid } from "../fuixlabs-documentor/utils/did.js";
import credentialService from "../services/VerifiableCredential.service.js";

/**
 * Create credential to authenticate the exchange of document ownership between the owner and the holders
 * @param {String} issuerDid
 * @param {String} holderDid
 * @param {String} didoWrappedDocument
 * @param {Object} metadata
 * @param {Object} action - purpose of creating credential
 * @param {String} signature
 * @return {Object} - return a credential
 */
const createClaimantVerifiableCredential = async ({ issuerKey, subject }) => {
    try {
        const credentialDid = generateRandomDID();
        let hashingCredential = {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://cml-resolver.ap.ngrok.io/config/dominium-credential.json",
            ],
            id: credentialDid,
            type: ["VerifiableCredential", "ClaimantCredential"],
            issuer: issuerKey,
        };
        const credentialHash = sha256(
            Buffer.from(
                `$${subject?.claims?.did}${issuerKey}`,
                "utf8"
            ).toString("hex")
        );
        const credential = {
            ...hashingCredential,
            credentialSubject: {
                id: generateDid(COMPANY_NAME, credentialHash),
                type: ["ClaimSubject"],
                claims: {
                    type: ["Claims"],
                    plot: subject?.claims?.plot,
                    user: subject?.claims?.did,
                    role: subject?.claims?.role,
                    plotCertificate: issuerKey,
                },
            },
        };
        const { verifiableCredential } =
            process.env.NODE_ENV === "test"
                ? {
                      verifiableCredential: credential,
                  }
                : await credentialService.issueVerifiableCredential({
                      credential,
                  });
        return {
            verifiableCredential,
            credentialHash,
            did: generateDid(COMPANY_NAME, credentialHash),
        };
    } catch (e) {
        throw e;
    }
};

const createContractVerifiableCredential = async ({
    issuerKey,
    subject,
    privateKey,
    publicKey,
}) => {
    try {
        const credentialDid = generateRandomDID();
        let hashingCredential = {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://cml-resolver.ap.ngrok.io/config/dominium-credential.json",
            ],
            id: credentialDid,
            type: ["VerifiableCredential", "ContractCredential"],
            issuer: issuerKey,
        };
        const credentialHash = sha256(
            Buffer.from(`$${subject?.userDid}${issuerKey}`, "utf8").toString(
                "hex"
            )
        );
        const credential = {
            ...hashingCredential,
            credentialSubject: {
                id: generateDid(COMPANY_NAME, credentialHash),
                type: ["ContractSubject"],
                ...subject,
            },
        };
        const { suite: CUSTOM_SUITE } = await setUpSuite({
            private_key: privateKey,
            public_key: publicKey,
        });
        const { verifiableCredential } =
            process.env.NODE_ENV === "test"
                ? {
                      verifiableCredential: credential,
                  }
                : await credentialService.issueVerifiableCredential({
                      credential,
                      customSuite: CUSTOM_SUITE,
                  });
        return {
            verifiableCredential,
            credentialHash,
            did: generateDid(COMPANY_NAME, credentialHash),
        };
    } catch (e) {
        throw e;
    }
};

export {
    createClaimantVerifiableCredential,
    createContractVerifiableCredential,
};
