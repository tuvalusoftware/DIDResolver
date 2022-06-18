const schemas = require("./schemas");
const examples = require("./examples");

module.exports.schemas = {
  ...schemas
}

module.exports.examples = {
  ...examples
}

module.exports.responses = {
  BadRequest: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/error",
        },
        examples: {
          "Missing parameters": {
            value: {
              errorCode: 400,
              errorMessage: "Bad request. Missing parameters.",
              detail: ""
            }
          },
          "Invalid input": {
            value: {
              errorCode: 400,
              errorMessage: "Bad request. Invalid input syntax.",
              detail: ""
            }
          }
        }
      }
    }
  },
}