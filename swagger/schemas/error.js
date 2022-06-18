const { _ } = require("ajv");

module.exports = {
    type: "object",
    properties: {
        errorCode: {
            type: "integer",
            description: "Error code",
            example: 400
        },
        errorMessage: {
            type: "string",
            description: "Error message",
            example: "Bad request. Missing Parameters."
        },
        detail: {
            type: "string",
            description: "Describe error in detail",
            require: false
        }
    }
}