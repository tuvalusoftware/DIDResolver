module.exports.checkExistWrappedDocument = {
    get: {
        tags: ["Wrapped document"],
        summary: "Check existence of a given wrapped document of a company.",
        parameters: [
            {
                name: "fileName",
                type: "string",
                in: "header",
                require: true,
                description: "Name of wrapped file.",
                // example: "did:method:companyName:publicKey",
                default: "srs"
            },
            {
                name: "companName",
                type: "string",
                in: "header",
                require: true,
                description: "Name of company.",
                default: "giabuynh"
            }
        ],
        responses: {
            200: {
                description: "OK. Return a "
            }
        }
    }
}