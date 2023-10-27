export default {
    MINT_DATA: {
        type: "object",
        required: ["wrappedDocument", "companyName", "did"],
        properties: {
            wrappedDocument: {
                type: "object",
                required: ["data", "signature"],
                properties: {
                    data: {
                        type: "object",
                        required: ["fileName", "did", "title"],
                    },
                    signature: {
                        type: "object",
                        required: ["type", "targetHash", "proof", "merkleRoot"],
                        properties: {
                            type: {
                                type: "string",
                            },
                            targetHash: {
                                type: "string",
                            },
                            proof: {
                                type: "array",
                            },
                            merkleRoot: {
                                type: "string",
                            },
                        },
                    },
                },
            },
            companyName: {
                type: "string",
            },
            url: {
                type: "string",
            },
            did: {
                type: "string",
            },
            plot: {
                type: "object",
            },
        },
        additionalProperties: true,
    },
    BURN_DATA: {
        type: "object",
        // required: ["type", "policy", "asset", "txHash"],
        properties: {
            type: {
                type: "string",
                enum: ["document", "credential"],
            },
            policy: {
                type: "object",
                required: ["type", "script", "ttl", "id"],
                properties: {
                    type: {
                        type: "string",
                    },
                    script: {
                        type: "string",
                    },
                    ttl: {
                        type: "number",
                    },
                    id: {
                        type: "string",
                    },
                },
            },
            asset: {
                type: "string",
            },
            txHash: {
                type: "string",
            },
        },
        additionalProperties: true,
    },
    UPDATE_DATA: {
        type: "object",
        required: ["wrappedDocument", "companyName", "did"],
        properties: {
            wrappedDocument: {
                type: "object",
                required: ["data", "signature"],
                properties: {
                    data: {
                        type: "object",
                        required: ["fileName", "did", "title"],
                    },
                    signature: {
                        type: "object",
                        required: ["type", "targetHash", "proof", "merkleRoot"],
                        properties: {
                            type: {
                                type: "string",
                            },
                            targetHash: {
                                type: "string",
                            },
                            proof: {
                                type: "array",
                            },
                            merkleRoot: {
                                type: "string",
                            },
                        },
                    },
                },
            },
            companyName: {
                type: "string",
            },
            url: {
                type: "string",
            },
            did: {
                type: "string",
            },
            plot: {
                type: "object",
            },
        },
        additionalProperties: true,
    },
    CREATE_CREDENTIAL_DATA: {
        type: "object",
        required: ["credential", "verifiedCredential"],
        properties: {
            mintingConfig: {
                type: "object",
            },
            credential: {
                type: "string",
            },
            verifiedCredential: {
                type: "object",
            },
        },
        additionalProperties: false,
    },
};
