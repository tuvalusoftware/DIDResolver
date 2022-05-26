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
        response: {
            200: {
                description: "",
                schema: { 
                    $ref: "#/definitions/didDocument"
                }
            },
            400: {
                description: "Missing parameters."
            },
            404: {
                description: "Do not exist"
            }
        }
    }
}