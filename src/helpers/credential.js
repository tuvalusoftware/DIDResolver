import { generateDid } from "../fuixlabs-documentor/utils/did.js";
import { sha256 } from "js-sha256";
import jsigs from "jsonld-signatures";
const {
    purposes: { AssertionProofPurpose },
} = jsigs;
import {
    getDynamicDocumentLoader,
    setUpSuite,
} from "../utils/verifiableCredential.js";
import { ADMIN_PRIVATE_KEY, ADMIN_PUBLIC_KEY } from "../config/constants.js";
import axios from "axios";
import { createClaimantVerifiableCredential } from "../utils/credential.js";

const { suite: DOMINIUM_SUITE } = await setUpSuite({
    private_key: ADMIN_PRIVATE_KEY,
    public_key: ADMIN_PUBLIC_KEY,
});

/**
 * A helper object containing methods for issuing and creating verifiable credentials.
 * @namespace VerifiableCredentialHelper
 */
export const VerifiableCredentialHelper = {
    /**
     * Issues a verifiable credential by signing the provided credential object.
     * @async
     * @memberof VerifiableCredentialHelper
     * @method issueVerifiableCredential
     * @param {Object} options - The options object.
     * @param {Object} options.credential - The credential object to sign.
     * @returns {Promise<Object>} A promise that resolves with the signed verifiable credential object.
     * @throws {Error} Throws an error if there was an issue signing the credential.
     */
    issueVerifiableCredential: async ({ credential, customSuite }) => {
        try {
            try {
                if (credential.hasOwnProperty("credentialSchema")) {
                    if (Array.isArray(credential.credentialSchema)) {
                        for (let schema of credential.credentialSchema) {
                            const { data: credentialSchema } = await axios.get(
                                schema.id
                            );
                            const { $schema } = credentialSchema;
                        }
                    }
                    // * credentialSchema props as an object
                    else if (typeof credential.credentialSchema == "object") {
                        const schema = credential.credentialSchema;
                        const { data: credentialSchema } = await axios.get(
                            schema.id
                        );
                        const { $schema } = credentialSchema;
                    }
                }
            } catch (error) {
                throw error;
            }
            try {
                const documentLoader = await getDynamicDocumentLoader(
                    credential["@context"]
                );
                const verifiableCredential = await jsigs.sign(credential, {
                    suite: customSuite ? customSuite : DOMINIUM_SUITE,
                    purpose: new AssertionProofPurpose(),
                    documentLoader,
                });
                return { verifiableCredential };
            } catch (error) {
                throw {
                    error_code: 400,
                    error_message: `Error sign contract: ${error.message}`,
                    details: error.details,
                };
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Creates a verifiable credential object with the provided data and signs it.
     * @async
     * @memberof VerifiableCredentialHelper
     * @method createClaimantVerifiableCredential
     * @param {Object} options - The options object.
     * @param {Object} options.signData - The data to sign the credential with.
     * @param {string} options.issuerKey - The issuer's key.
     * @param {Object} options.subject - The subject of the credential.
     * @param {string} options.credentialDid - The DID of the credential.
     * @returns {Promise<Object>} A promise that resolves with the signed verifiable credential object.
     * @throws {Error} Throws an error if there was an issue creating or signing the credential.
     */
    createClaimantVerifiableCredential: async ({
        signData,
        issuerKey,
        subject,
        credentialDid,
    }) => {
        try {
            const credential = {
                "@context": [
                    "https://www.w3.org/ns/credentials/v2",
                    "https://www.w3.org/ns/credentials/examples/v2",
                ],
                id: credentialDid,
                type: ["VerifiableCredential"],
                issuer: generateDid(process.env.COMPANY_NAME, issuerKey),
                validFrom: new Date().toISOString(),
                credentialSubject: subject,
                proof: {
                    type: "Ed25519Signature2020",
                    created: "2021-11-13T18:19:39Z",
                    verificationMethod:
                        "https://university.example/issuers/14#key-1",
                    proofPurpose: "assertionMethod",
                    proofValue: JSON.stringify(signData),
                },
            };
            return { credential };
        } catch (e) {
            throw e;
        }
    },

    /**
     * Creates verifiable credential DIDs for the provided claimants.
     * @async
     * @memberof VerifiableCredentialHelper
     * @method getCredentialDidsFromClaimants
     * @param {Object} options - The options object.
     * @param {Array<Object>} options.claimants - The claimants to create DIDs for.
     * @param {string} options.did - The DID of the issuer.
     * @param {string} options.companyName - The name of the company.
     * @param {string} options.plotId - The ID of the plot.
     * @returns {Promise<Object>} A promise that resolves with an object containing the created DIDs and plot ID.
     * @throws {Error} Throws an error if there was an issue creating the DIDs.
     */
    getCredentialDidsFromClaimants: async ({
        claimants,
        did,
        companyName,
        plotId,
    }) => {
        try {
            const promises = claimants.map(async (claimant) => {
                const { credentialHash } =
                    await createClaimantVerifiableCredential({
                        subject: {
                            claims: {
                                plot: plotId,
                                ...claimant,
                            },
                        },
                        issuerKey: did,
                    });
                return {
                    userId: claimant?._id,
                    did: generateDid(companyName, credentialHash),
                };
            });
            const data = await Promise.all(promises);
            return {
                claimants: data,
                plot: did,
            };
        } catch (error) {
            throw error;
        }
    },
    verifyVerifiableCredential: async ({ credential }) => {
        const documentLoader = await getDynamicDocumentLoader(
            credential["@context"]
        );
        const data = await jsigs.verify(credential, {
            suite: DOMINIUM_SUITE,
            purpose: new AssertionProofPurpose(),
            documentLoader,
        });
        return data;
    },
};
