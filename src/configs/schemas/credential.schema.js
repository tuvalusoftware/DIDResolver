/**
 * JSON schema for a verifiable credential.
 * @typedef {Object} VerifiableCredentialSchema
 * @property {Object} VERIFIABLE_CREDENTIAL - The schema for a verifiable credential.
 * @property {string[]} VERIFIABLE_CREDENTIAL.required - The required properties for a verifiable credential.
 * @property {Object} VERIFIABLE_CREDENTIAL.properties - The properties of a verifiable credential.
 * @property {Object} VERIFIABLE_CREDENTIAL.properties.@context - The context of a verifiable credential.
 * @property {string[]} VERIFIABLE_CREDENTIAL.properties.@context.type - The type of the context of a verifiable credential.
 * @property {string[]} VERIFIABLE_CREDENTIAL.properties.@context.items.enum - The allowed values for the context of a verifiable credential.
 * @property {Object} VERIFIABLE_CREDENTIAL.properties.type - The type of a verifiable credential.
 * @property {string[]} VERIFIABLE_CREDENTIAL.properties.type.items.enum - The allowed values for the type of a verifiable credential.
 * @property {string} VERIFIABLE_CREDENTIAL.properties.issuer - The issuer of a verifiable credential.
 * @property {string} VERIFIABLE_CREDENTIAL.properties.validFrom - The valid from date of a verifiable credential.
 * @property {Object} VERIFIABLE_CREDENTIAL.properties.proof - The proof of a verifiable credential.
 * @property {string[]} VERIFIABLE_CREDENTIAL.properties.proof.required - The required properties for the proof of a verifiable credential.
 * @property {Object} VERIFIABLE_CREDENTIAL.properties.proof.properties - The properties of the proof of a verifiable credential.
 * @property {string} VERIFIABLE_CREDENTIAL.properties.proof.properties.created - The creation date of the proof of a verifiable credential.
 * @property {Object} VERIFIABLE_CREDENTIAL.properties.proof.properties.signature - The signature of the proof of a verifiable credential.
 * @property {string} VERIFIABLE_CREDENTIAL.properties.proof.properties.signature.key - The key of the signature of the proof of a verifiable credential.
 * @property {string} VERIFIABLE_CREDENTIAL.properties.proof.properties.signature.value - The value of the signature of the proof of a verifiable credential.
 * @property {Object} VERIFIABLE_CREDENTIAL.properties.credentialSubject - The subject of a verifiable credential.
 * @property {string[]} VERIFIABLE_CREDENTIAL.properties.credentialSubject.required - The required properties for the subject of a verifiable credential.
 * @property {Object} VERIFIABLE_CREDENTIAL.properties.credentialSubject.properties - The properties of the subject of a verifiable credential.
 * @property {string} VERIFIABLE_CREDENTIAL.properties.credentialSubject.properties.id - The ID of the subject of a verifiable credential.
 * @property {boolean} VERIFIABLE_CREDENTIAL.additionalProperties - Whether additional properties are allowed for a verifiable credential.
 * @property {Object} CREDENTIAL_SUBJECT - The schema for a credential subject.
 * @property {Object} CREDENTIAL_SUBJECT.items - The items of a credential subject.
 * @property {string[]} CREDENTIAL_SUBJECT.items.required - The required properties for an item of a credential subject.
 * @property {Object} CREDENTIAL_SUBJECT.items.properties - The properties of an item of a credential subject.
 * @property {string} CREDENTIAL_SUBJECT.items.properties.id - The ID of an item of a credential subject.
 * @property {boolean} CREDENTIAL_SUBJECT.items.additionalProperties - Whether additional properties are allowed for an item of a credential subject.
 */
export default {
    VERIFIABLE_CREDENTIAL: {
        type: "object",
        required: [
            "@context",
            "type",
            "issuer",
            "credentialSubject",
            "signature",
            "proof",
        ],
        properties: {
            "@context": {
                type: "array",
                items: {
                    type: "string",
                    enum: [
                        "https://www.w3.org/ns/credentials/v2",
                        "https://www.w3.org/ns/credentials/examples/v2",
                    ],
                },
            },
            type: {
                type: "array",
                items: {
                    type: "string",
                    enum: ["VerifiableCredential"],
                },
            },
            issuer: {
                type: "string",
            },
            validFrom: {
                type: "string",
            },
            proof: {
                type: "object",
                required: ["created", "signature"],
                properties: {
                    created: {
                        type: "string",
                    },
                    signature: {
                        type: "object",
                        required: ["key", "value"],
                        properties: {
                            key: {
                                type: "string",
                            },
                            value: {
                                type: "string",
                            },
                        },
                        additionalProperties: false,
                    },
                    additionalProperties: true,
                },
                additionalProperties: false,
            },
            credentialSubject: {
                type: "object",
                required: ["id"],
                properties: {
                    id: {
                        type: "string",
                    },
                },
                additionalProperties: true,
            },
        },
        additionalProperties: false,
    },
    CREDENTIAL_SUBJECT: {
        type: "array",
        items: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                },
                additionalProperties: true,
            },
        },
    },
};
