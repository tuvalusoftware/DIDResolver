import { generateDid } from "../fuixlabs-documentor/utils/did.js";
import jsigs from "jsonld-signatures";
import axios from "axios";
const {
    purposes: { AssertionProofPurpose },
} = jsigs;
import {
    getDynamicDocumentLoader,
    setUpSuite,
} from "../utils/verifiableCredential.js";
import {
    env,
} from "../configs/constants.js";
import { createClaimantVerifiableCredential } from "../utils/credential.js";
const { suite: DOMINIUM_SUITE } = await setUpSuite({
    private_key: env.ADMIN_PRIVATE_KEY,
    public_key: env.ADMIN_PUBLIC_KEY,
});

/**
 * A service for issuing and verifying verifiable credentials.
 */
class VerifiableCredentialService {
    /**
     * Issues a verifiable credential.
     * @param {Object} options - The options for issuing the credential.
     * @param {Object} options.credential - The credential to issue.
     * @param {Object} [options.customSuite] - The custom suite to use for signing the credential.
     * @returns {Promise<Object>} A promise that resolves with the issued verifiable credential.
     * @throws {Error} If there is an error issuing the credential.
     */
    async issueVerifiableCredential({ credential, customSuite }) {
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
                    } else if (typeof credential.credentialSchema == "object") {
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
    }

    /**
     * Verifies a verifiable credential.
     * @param {Object} options - The options for verifying the credential.
     * @param {Object} options.credential - The credential to verify.
     * @returns {Promise<Object>} A promise that resolves with the verification result.
     * @throws {Error} If there is an error verifying the credential.
     */
    async verifyVerifiableCredential({ credential }) {
        const documentLoader = await getDynamicDocumentLoader(
            credential["@context"]
        );
        const data = await jsigs.verify(credential, {
            suite: DOMINIUM_SUITE,
            purpose: new AssertionProofPurpose(),
            documentLoader,
        });
        return data;
    }

    /**
     * Creates a verifiable credential for a claimant.
     * @param {Object} options - The options for creating the credential.
     * @param {Object} options.signData - The data to sign.
     * @param {string} options.issuerKey - The issuer's key.
     * @param {Object} options.subject - The credential subject.
     * @param {string} options.credentialDid - The credential's DID.
     * @returns {Promise<Object>} A promise that resolves with the created verifiable credential.
     */
    async createClaimantVerifiableCredential({
        signData,
        issuerKey,
        subject,
        credentialDid,
    }) {
        const credential = {
            "@context": [
                "https://www.w3.org/ns/credentials/v2",
                "https://www.w3.org/ns/credentials/examples/v2",
            ],
            id: credentialDid,
            type: ["VerifiableCredential"],
            issuer: generateDid(env.COMPANY_NAME, issuerKey),
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
    }

    /**
     * Gets the credential DIDs for a list of claimants.
     * @param {Object} options - The options for getting the credential DIDs.
     * @param {Array<Object>} options.claimants - The list of claimants.
     * @param {string} options.did - The DID.
     * @param {string} options.companyName - The company name.
     * @param {string} options.plotId - The plot ID.
     * @returns {Promise<Object>} A promise that resolves with the credential DIDs for the claimants and plot.
     * @throws {Error} If there is an error getting the credential DIDs.
     */
    async getCredentialDidsFromClaimants({
        claimants,
        did,
        companyName,
        plotId,
    }) {
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
    }
}

const credentialService = new VerifiableCredentialService();
export default credentialService;
