const { schemas } = require("./components");

module.exports.checkExistWrappedDocument = {
    get: {
        tags: ["Wrapped document"],
        summary: "Check existence of a given wrapped document of a company.",
        parameters: [
            {
                in: "header",
                name: "fileName",
                type: "string",
                require: true,
                description: "Name of wrapped file.",
                example: "srs"
            },
            {                
                in: "header",
                name: "companyName",
                type: "string",
                require: true,
                description: "Name of company.",
                example: "giabuynh"
            }
        ],
        responses: {
            200: {
                description: "OK. Return true/false value representing the exsitence of the given wrapped document name in the given company storage.",
                content: {
                    
                }
            },
            400: {
                description: "Bad request.",
                content: {
                    "application/json": {
                        schemas: {
                            type: "object"
                        }
                    }
                }
            }
        }
    }
}