module.exports.getDidDocument = {
    get: {
        tags: ["DID document"],
        summary: "Resolve DID - Takes a DID as input and produces a conforming DID document as output.",
        parameters: [
            {
                in: "header",
                name: "did",
                type: "string",
                require: true,
                description: "DID string. Syntax: did:method:companyName:publicKey.",
                example: "did:method:companyName:publicKey",
                default: "did:method:giabuynh:srs"
            }
        ],
        responses: {
            200: {
                description: "OK. Return a conforming DID document.",
                schema: { 
                    $ref: "#/components/schemas/didDocument"
                }
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
            },
            404: {
                description: "Cannot found DID document with a companyName and publicKey included in DID string.",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/errorMessageDIDController"
                        }
                    }
                }
            }
        }
    }
}

module.exports.postDidDocument = {
    post: {
        tags: ["DID document"],
        summary: "Create DID document for a given DID",
        parameters: [],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            did: {
                                type: "string",
                                example: "did:method:giabuynh:srs"
                            },
                            didDocument: {
                                type: "object",
                                properties: {
                                    controller: {
                                        type: "string"
                                    },
                                    id: {
                                        type: "string",
                                    },
                                    date: {
                                        type: "string"
                                    }
                                },
                                example: {
                                    $ref: "#/components/examples/didDocumentContent"
                                }
                            }
                        }
                    },
                }
            }
        },
        responses: {
            201: {
                description: "Created. New DID document is successfully created.",
                content: {
                    "text/plain": {
                        schema: {
                            type: "string",
                            example: "DID Document created."
                        }
                    }
                }
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
                            $ref: "#/components/schemas/errorMessageDIDController"
                        }
                    }
                }
            }
        }
    }
}