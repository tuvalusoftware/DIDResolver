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
          "Missing parameters": { $ref: "#/components/examples/errorMissingParameters" },
          "Invalid input": { $ref: "#/components/examples/errorInvalidInput" }
        }
      }
    }
  },
}

// console.log(this.responses.BadRequest.content);