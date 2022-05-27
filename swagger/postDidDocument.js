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
                type: "object",
                in: "body",
                require: true,
                description: "Content of the DID document",
                schema: { $ref: "#/definitions/didDocument" }
            }
        ],
        responses: {
            201: {
                description: "Created sucess. New DID document is created.",
                schema: {
                    message: "New DID created sucessfully"
                }
            },
            400: {
                description: "Bad request. ",
                schema: {
                    type: "string",
                    example: ""
                }
            }
        }
    }
}