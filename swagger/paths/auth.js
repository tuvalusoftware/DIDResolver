module.exports.getPublicKeyFromAddress = {
  get: {
    tags: ["Others"],
    summary: "???",
    parameters: [
      {
        in: "cookie",
        name: "access_token",
        type: "string",
        require: true,
        description: "Access token of current user",
      },
      {
        in: "query",
        name: "address",
        type: "string",
        require: true,
        description: "Address."
      }
    ],
    responses: {
      200: {
        description: "???",
        content: {
          "application/json": {
            schema: {
              example: {
                publicKey: "something"
              }
            }
          }
        }
      },
      400: {
        description: "Missing parameters or invalid input",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/error" },
            examples: {
              "Missing parameters": { $ref: "#/components/examples/errorMissingParameters" },
              "Invalid input": { $ref: "#/components/examples/errorInvalidInput" }
            }
          }
        }
      },
      401: {
        $ref: "#/components/responses/Unauthorized"
      },
    }
  }
}