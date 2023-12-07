import { generateDid } from "../fuixlabs-documentor/utils/did.js";
import jsigs from "jsonld-signatures";
import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import axios from "axios";
import cred from "credentials-context";
import ed25519Ctx from "ed25519-signature-2020-context";
import { JsonLdDocumentLoader } from "jsonld-document-loader";
import { generateRandomDID } from "../utils/index.js";
import { sha256 } from "js-sha256";
import {
    CONTEXT as EdTechJsonSchemaValidator2019Context,
    CONTEXT_URL as EdTechJsonSchemaValidator2019ContextURL,
} from "../configs/contexts/1EdTechJsonSchemaValidator2019.js";
import {
    CONTEXT as VCContext,
    CONTEXT_URL as VCContextURL,
} from "../configs/contexts/VCSchema.js";
import {
    CONTEXT as odrlContext,
    CONTEXT_URL as odrlContextURL,
} from "../configs/contexts/odrl.js";
import {
    CONTEXT as vcedContext,
    CONTEXT_URL as vcedContextURL,
} from "../configs/contexts/vced.js";
const {
    purposes: { AssertionProofPurpose },
} = jsigs;
import { env } from "../configs/constants.js";
import { AppError } from "../configs/errors/appError.js";

async function getDynamicDocumentLoader(contexts) {
    const {
        contexts: credentialsContexts,
        constants: { CREDENTIALS_CONTEXT_V1_URL },
    } = cred;

    const jdl = new JsonLdDocumentLoader();

    jdl.addStatic(
        CREDENTIALS_CONTEXT_V1_URL,
        credentialsContexts.get(CREDENTIALS_CONTEXT_V1_URL)
    );
    jdl.addStatic(ed25519Ctx.CONTEXT_URL, ed25519Ctx.CONTEXT);
    jdl.addStatic(vcedContextURL, vcedContext);
    jdl.addStatic(odrlContextURL, odrlContext);
    jdl.addStatic(VCContextURL, VCContext);
    jdl.addStatic(
        EdTechJsonSchemaValidator2019ContextURL,
        EdTechJsonSchemaValidator2019Context
    );

    const documentURLs = [...jdl.documents.keys()];
    for (let url of contexts) {
        if (typeof url !== "string" || documentURLs.includes(url)) continue;

        try {
            const { data } = await axios.get(url);
            jdl.addStatic(url, data);
        } catch (e) {
            throw `ERROR LOAD CONTEXT OF ${url}: ${e}`;
        }
    }

    return jdl.build();
}

async function setUpSuite({ public_key, private_key }) {
    const issuer = {
        id: `did:key:${public_key}#${public_key}`,
        name: "Dominium Issuer",
    };
    const _keyPair = {
        issuer,
        id: issuer.id,
        publicKeyBase58: public_key,
        privateKeyBase58: private_key,
    };
    const keyPair = await Ed25519VerificationKey2020.from({
        type: "Ed25519VerificationKey2018",
        keyPair: _keyPair,
    });
    const suite = await new Ed25519Signature2020({ key: keyPair });
    suite.date = new Date().toISOString();

    return { suite, issuer };
}

const { suite: DOMINIUM_SUITE } = await setUpSuite({
    private_key: env.ADMIN_PRIVATE_KEY,
    public_key: env.ADMIN_PUBLIC_KEY,
});

/**
 * A service for issuing and verifying verifiable credentials.
 */
class VerifiableCredentialService {
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
                throw new AppError(
                    {
                        error_code: 400,
                        error_message: `Error sign contract: ${error.message}`,
                    },
                    error.details
                );
            }
        } catch (error) {
            throw error;
        }
    }

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

    async createClaimantVerifiableCredential({ issuerKey, subject }) {
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
                    id: generateDid(env.COMPANY_NAME, credentialHash),
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
                env.NODE_ENV === "test"
                    ? {
                          verifiableCredential: credential,
                      }
                    : await credentialService.issueVerifiableCredential({
                          credential,
                      });
            return {
                verifiableCredential,
                credentialHash,
                did: generateDid(env.COMPANY_NAME, credentialHash),
            };
        } catch (e) {
            throw e;
        }
    }

    async createContractVerifiableCredential({
        issuerKey,
        subject,
        privateKey,
        publicKey,
    }) {
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
                Buffer.from(
                    `$${subject?.userDid}${issuerKey}`,
                    "utf8"
                ).toString("hex")
            );
            const credential = {
                ...hashingCredential,
                credentialSubject: {
                    id: generateDid(env.COMPANY_NAME, credentialHash),
                    type: ["ContractSubject"],
                    ...subject,
                },
            };
            const { suite: CUSTOM_SUITE } = await setUpSuite({
                private_key: privateKey,
                public_key: publicKey,
            });
            const { verifiableCredential } =
                env.NODE_ENV === "test"
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
                did: generateDid(env.COMPANY_NAME, credentialHash),
            };
        } catch (e) {
            throw e;
        }
    }

    async getCredentialDidsFromClaimants({
        claimants,
        did,
        companyName,
        plotId,
    }) {
        try {
            const promises = claimants.map(async (claimant) => {
                const { credentialHash } =
                    await this.createClaimantVerifiableCredential({
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
