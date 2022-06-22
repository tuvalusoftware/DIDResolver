module.exports.createCredential = {
  post: {
    tags: ["Credential"],
    summary: "Create credential for endorsing/changing/nominating ownership or holdership.",
    parameters: [
      {
        in: "cookie",
        name: "access_token",
        type: "string",
        require: true,
        description: "Access token of current user",
      }
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              did: {
                type: "string",
                example: "did:method:Kukulu:public_key"
              },
              credential: {
                $ref: "#/components/schemas/credential"
              }
            }
          },
        }
      }
    },
    responses: {
      201: {
        description: "New credential is successfully created.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Credential created."
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
      404: {
        $ref: "#/components/responses/NotFound_DIDDocument"
      }
    }
  }
}