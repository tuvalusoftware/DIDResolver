import { ERRORS } from "../../errors/error.constants.js";

export const contract = {
    post: {
        tags: ["Commonlands Contract"],
        summary: "Create contract for Commonlands",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            wrappedDoc: {
                                type: "object",
                                example: {
                                    _id: "652faaab0a0679ca3824d270",
                                    link: "https://docs.google.com/doc/12345",
                                    hash: "HHiiiUUUU",
                                    underwriter: "651e25b0eeacd4968d1257a0",
                                    createdAt: "2023-10-18T09:51:39.599Z",
                                },
                            },
                            metadata: {
                                type: "object",
                                example: { status: "created" },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an array include credential'hashes if success",
                content: {
                    "application/json": {
                        examples: {
                            "Create plot contract successfully": {
                                value: {
                                    hashes: [
                                        "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
                                    ],
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: owner",
                                },
                            },
                            "Document already exists": {
                                value: {
                                    url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                                    isExisted: true,
                                },
                            },
                            "Cannot mint nft for credential": {
                                value: ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT,
                            },
                        },
                    },
                },
            },
        },
    },
    put: {
        tags: ["Commonlands Contract"],
        summary: "Update contract for Commonlands",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            metadata: {
                                type: "object",
                                example: {
                                    status: "created",
                                    role: "borrower",
                                },
                            },
                            did: {
                                type: "string",
                                example:
                                    "did:fuixlabs:COMMONLANDS_2:LandCertification-64db86559e77a4ffc2395ada_119",
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an array include credential'hashes if success",
                content: {
                    "application/json": {
                        examples: {
                            "Create plot contract successfully": {
                                value: {
                                    hashes: [
                                        "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
                                    ],
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: owner",
                                },
                            },
                            "Document already exists": {
                                value: {
                                    url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                                    isExisted: true,
                                },
                            },
                            "Cannot mint nft for credential": {
                                value: ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT,
                            },
                        },
                    },
                },
            },
        },
    },
};

export const signContract = {
    post: {
        tags: ["Commonlands Contract"],
        summary: "Sign contract for Commonlands",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            contract: {
                                type: "string",
                                example:
                                    "did:example:example2:123456789abcdefghi",
                            },
                            role: {
                                type: "string",
                                example: "borrower",
                            },
                            claimant: {
                                type: "object",
                                properties: {
                                    certificateDid: {
                                        type: "string",
                                        example:
                                            "did:example:example2:123456789abcdefghi",
                                    },
                                    seedPhrase: {
                                        type: "string",
                                        example: "seedPhrase",
                                    },
                                    userDid: {
                                        type: "string",
                                        example:
                                            "did:example:example2:123456789abcdefghi",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an array include credential'hashes if success",
                content: {
                    "application/json": {
                        examples: {
                            "Create plot contract successfully": {
                                value: {
                                    hashes: [
                                        "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
                                    ],
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: owner",
                                },
                            },
                            "Document already exists": {
                                value: {
                                    url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                                    isExisted: true,
                                },
                            },
                            "Cannot mint nft for credential": {
                                value: ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT,
                            },
                        },
                    },
                },
            },
        },
    },
};

export const getContract = {
    get: {
        tags: ["Commonlands Contract"],
        summary: "Get Contract information",
        parameters: [
            {
                name: "did",
                in: "path",
                schema: {
                    type: "string",
                    example:
                        "did:fuixlabs:COMMONLANDS_2:LandCertification-64db86559e77a4ffc2395ada_119",
                },
                required: true,
                description: "DID of the contract",
            },
        ],
        responses: {
            200: {
                description:
                    "Return an object include document information if success",
                content: {
                    "application/json": {
                        examples: {
                            "Get PDF file successfully": {
                                value: {
                                    success: true,
                                    url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1695204643781_TESTING_COMMONLANDS-LandCertificate-14088960050-64db86559e77a4ffc2395ada_103.pdf",
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: did",
                                },
                            },
                            "Invalid DID": {
                                value: {
                                    error_code: 400,
                                    error_message: "Invalid DID",
                                },
                            },
                            "Cannot get document information": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Cannot get document information",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
