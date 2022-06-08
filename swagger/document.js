module.exports.getDocument = {
    get: {
        tags: ["Others"],
        summary: "Get DID document and/or wrapped document by a DID.",
        parameters: [
            {
                in: "header",
                name: "did",
                type: "string",
                require: true,
                description: "DID string. Syntax: did:method:companyName:publicKey.",
                example: "did:method:companyName:publicKey",
                default: "did:method:giabuynh:srs"
            },
            {
                in: "query",
                name: "exclude",
                type: "string",
                require: false,
                description: "Optional parameter to...",
                example: "'did' or 'doc' or undefined",
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
                            propeties: {
                                wrapDoc: {
                                    type: "object"
                                },
                                didDoc: {
                                    type: "object"
                                }
                            },
                            example: {
                                "wrapDoc": {},
                                "didDoc": {}
                            }
                        }
                    }
                },
            },
            400: {
                description: "Bad request. Input DID is invalid or undefined.",
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
                            example: {}
                        }
                    }
                }
            }
        }
    }
}