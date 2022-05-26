module.exports.definitions = {
    didDocument: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Name of DID document, usually is DID string.",
                example: "did:tradetrust:Kukulu:1234xyzt"
            },
            content: {
                type: "object",
                description: "Example content in JSON format.",
                example: {
                    date: "10-10-2000"
                }
            }
        }
    }
    
}