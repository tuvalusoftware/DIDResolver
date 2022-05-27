module.exports.getDidDocument = {
    get: {
        tags: ["DID document"],
        summary: "Resolve DID - Takes a DID as input and produces a conforming DID document as output.",
        parameters: [
            {
                name: "did",
                type: "string",
                in: "header",
                require: true,
                description: "DID string. Syntax: did:method:companyName:publicKey.",
                example: "did:tradetrust:Kukulu:1212wfnajskfhowbr1323irbiu3bkajbfjakbs."
            }
        ],
        responses: {
            200: {
                description: "OK. Return a conforming DID document.",
                schema: { 
                    $ref: "#/definitions/didDocument"
                }
            },
            400: {
                description: "Bad request. Input DID is invalid or undefined.",
                schema: {
                    type: "string",
                    example: "Missing parameters."
                }
            },
            404: {
                description: "Cannot found DID document with a companyName and publicKey included in DID string.",
                schema: {
                    type: "string",
                    example: "Not found."
                }
            }
        }
    }
}