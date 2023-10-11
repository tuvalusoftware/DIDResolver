import { generateDid } from "../fuixlabs-documentor/utils/did.js";
import { sha256 } from "js-sha256";
import jsigs from "jsonld-signatures";
const {
    purposes: { AssertionProofPurpose },
} = jsigs;
import {
    getDynamicDocumentLoader,
    setUpSuite,
} from "../api/utils/verifiableCredential.js";
import { ADMIN_PRIVATE_KEY, ADMIN_PUBLIC_KEY } from "../config/constants.js";
import axios from "axios";
import { createVerifiableCredential } from "../api/utils/credential.js";

const { suite: DOMINIUM_SUITE, issuer: DOMINIUM_ISSUER } = await setUpSuite({
    private_key: ADMIN_PRIVATE_KEY,
    public_key: ADMIN_PUBLIC_KEY,
});

export const VerifiableCredentialHelper = {
    issueVerifiableCredential: async ({ credential }) => {
        try {
            try {
                if (credential.hasOwnProperty("credentialSchema")) {
                    if (Array.isArray(credential.credentialSchema)) {
                        for (let schema of credential.credentialSchema) {
                            const { data: credentialSchema } = await axios.get(
                                schema.id
                            );
                            const { $schema, ...rest } = credentialSchema;
                            // const { isValid, errors } =
                            //     SchemaValidator.validate(credential, rest);

                            // if (!isValid) {
                            //     return {
                            //         error_code: `Invalid Credential Schema`,
                            //         error_message: errors,
                            //     };
                            // }
                        }
                    }
                    // * credentialSchema props as an object
                    else if (typeof credential.credentialSchema == "object") {
                        const schema = credential.credentialSchema;
                        const { data: credentialSchema } = await axios.get(
                            schema.id
                        );
                        const { $schema, ...rest } = credentialSchema;
                        // const { isValid, errors } = SchemaValidator.validate(
                        //     credential,
                        //     rest
                        // );
                        // if (!isValid) {
                        //     return {
                        //         error_code: `Invalid Credential Schema`,
                        //         error_message: errors,
                        //     };
                        // }
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
                    suite: DOMINIUM_SUITE,
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
    createVerifiableCredential: async ({
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
    getCredentialDidsFromClaimants: async ({
        claimants,
        did,
        companyName,
        plotId,
    }) => {
        try {
            const promises = claimants.map(async (claimant) => {
                const { credentialHash } = await createVerifiableCredential({
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
};
