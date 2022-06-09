module.exports.verifyHash = {
    get: {
        tags: ["Others"],
        summary: "Verify issuer hash",
        parameters: [
            {
                in: "header",
                name: "hashOfDocument",
                type: "string",
                require: true,
                description: "Hash of the given document.",
                example: "",
                default: ""
            },
            {
                in: "header",
                name: "policyId",
                type: "string",
                require: true,
                description: "Policy ID of the given document.",
                example: "",
                default: ""
            }
        ],
        responses: {
            200: {
                description: "",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {

                            }
                        }
                    }
                }
            },
            400: {
                description: "",
                content: {
                    "text/plain": {
                        schema: {
                            type: "string",
                            example: "Missing parameters."
                        }
                    },
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {

                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports.verifySignature = {
    get: {
        tags: ["Others"],
        summary: "Verify user's signature.",
        parameters: [
            {
                in: "header",
                name: "address",
                type: "string",
                require: true,
                description: "Address of user.",
                example: "",
                default: ""
            },
            {
                in: "header",
                name: "payload",
                type: "string",
                require: true,
                description: "Payload.",
                example: "",
                default: ""
            },
            {
                in: "header",
                name: "signature",
                type: "string",
                require: true,
                description: "Signature of user.",
                example: "",
                default: ""
            }
        ],
        responses: {
            200: {
                description: "",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {

                            }
                        }
                    }
                }
            },
            400: {
                description: "",
                content: {
                    "text/plain": {
                        schema: {
                            type: "string",
                            example: "Missing parameters."
                        }
                    },
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {

                            }
                        }
                    }
                }
            }
        }
    }
}