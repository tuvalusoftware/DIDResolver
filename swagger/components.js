module.exports.schemas = {
    errorMessageDIDController: {
        type: "object",
        properties: {
            errorCode: {
                type: "integer",
                summary: "Error Code.",
            },
            message: {
                type: "string",
                summary: "Error message from DIDController.",
            }
        }
    },
    didDocument: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Name of DID document, usually is DID string.",
                example: "did:method:giabuynh:srs"
            },
            content: {
                type: "object",
                properties: {
                    
                },
                description: "Example content in JSON format.",
                example: {
                    date: "10-10-2000"
                }
            }
        }
    },
}

module.exports.examples = {
    didDocumentContent: {
        controller: "someonePublicKey",
        id: "did:method:giabynh:srs",
        date: "10-10-2000"
    }
}