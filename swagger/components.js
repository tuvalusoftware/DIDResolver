const schemas = require("./schemas");
const examples = require("./examples");


module.exports.schemas = {
  ...schemas
}

module.exports.examples = {
  ...examples
}

// module.exports.securitySchemes = {
//   cookieAuth: {
//     type: "apiKey",
//     in: "cookie",
//     name: "access_token"
//   }
// }

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
  Unauthorized: {
    description: "Cannot verify user with the given access token.",
    content: {
      "text/plain": {
        schema: {
          type: "string",
          example: "Unauthorized."
        }
      }
    }
  },
  NotFound_DIDDocument: {
    description: "DID document or/and wrapped document are not found.",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            errorCode: { type: "integer" },
            message: { type: "string" }
          },
        },
        examples: {
          "No file": {
            value: {
              errorCode: 10004,
              message: "File/Public Key with the given value cannot be found."
            }
          },
          "No branch": {
            value: {
              errorCode: 10003,
              message: "Company with the given name cannot be found."
            }
          },
        }
      }
    }
  }
}