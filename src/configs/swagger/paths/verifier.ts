export const certificateVerifier = {
    post: {
        tags: ["Verifier"],
        description: "Verify certificate",
        operationId: "verifyCertificate",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            did: {
                                type: "string",
                                description: "DID of the document",
                                example: "did:example:ethr:0x123456789abcdef",
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Certificate is valid",
                content: {
                    "application/json": {
                        schema: {
                            valid: {
                                type: "boolean",
                                description: "Certificate is valid",
                                example: true,
                            },
                        },
                    },
                },
            },
        },
    },
};

export const credentialVerifier = {
    post: {
        tags: ["Verifier"],
        description: "Verify verifiable credential",
        operationId: "verifyVerifiableCredential",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            did: {
                                type: "string",
                                description: "DID of the document",
                                example: "did:example:ethr:0x123456789abcdef",
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Certificate is valid",
                content: {
                    "application/json": {
                        schema: {
                            valid: {
                                type: "boolean",
                                description: "Certificate is valid",
                                example: true,
                            },
                        },
                    },
                },
            },
        },
    },
};
