import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import axios from "axios";
import cred from "credentials-context";
import ed25519Ctx from "ed25519-signature-2020-context";
import { JsonLdDocumentLoader } from "jsonld-document-loader";
import {
    CONTEXT as EdTechJsonSchemaValidator2019Context,
    CONTEXT_URL as EdTechJsonSchemaValidator2019ContextURL,
} from "../config/contexts/1EdTechJsonSchemaValidator2019.js";
import {
    CONTEXT as VCContext,
    CONTEXT_URL as VCContextURL,
} from "../config/contexts/VCSchema.js";
import {
    CONTEXT as odrlContext,
    CONTEXT_URL as odrlContextURL,
} from "../config/contexts/odrl.js";
import {
    CONTEXT as vcedContext,
    CONTEXT_URL as vcedContextURL,
} from "../config/contexts/vced.js";

/**
 * @description Get Document Loader with full contexts
 * @param {Array} contexts List of JSONLD contexts
 * @returns Document Loader
 */
export async function getDynamicDocumentLoader(contexts) {
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

/**
 * Set up signature suite
 */
export async function setUpSuite({ public_key, private_key }) {
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

export const generateMultibaseKeyPair = async () => {
    try {
        const { publicKeyMultibase, privateKeyMultibase } =
            await Ed25519VerificationKey2020.generate();
    } catch (error) {
        throw error;
    }
};
