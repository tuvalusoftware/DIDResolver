module.exports.postDidDocument = {
    post: {
        tags: ["DID document"],
        summary: "Create DID document for a given DID",
        parameters: [
            {
                name: "did",
                type: "string",
                in: "body",
                require: true,
                description: "DID string. Syntax: did:method:companyName:publicKey",
                example: "did:tradetrust:Kukulu:1221qwaksjfbihriu3ekafbkasjbfkabsfkasbfnke31"
            },
            {
                name: "didDocument",
                type: "string",
                in: "body",
                require: true,
                description: "Content of the DID document",
                example: { $ref: "#/defininition/didDocument" }
            }
        ],
        response: {
            200: {},
            400: {}
        }
    }
}