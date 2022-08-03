module.exports.createCredential = {
  post: {
    tags: ["Credential"],
    summary:
      "Create credential for endorsing/changing/nominating ownership or holdership.",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              did: {
                type: "string",
                example: "did:method:Kukulu:file_name",
              },
              credential: {
                $ref: "#/components/schemas/credential",
              },
              config: {
                $ref: "#/components/schemas/mintingNFTConfig",
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: "New credential is successfully created.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Credential created.",
            },
          },
        },
      },
      400: {
        description: "Missing parameters or invalid input",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/error" },
            examples: {
              "Missing parameters": {
                $ref: "#/components/examples/errorMissingParameters",
              },
              "Invalid input": {
                $ref: "#/components/examples/errorInvalidInput",
              },
            },
          },
        },
      },
      401: {
        $ref: "#/components/responses/Unauthorized",
      },
      403: {
        description: "Signature cannot be verified",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/error" },
            examples: {
              "Unverified signature": {
                $ref: "#/components/examples/errorUnverifiedSignature",
              },
            },
          },
        },
      },
      404: {
        $ref: "#/components/responses/NotFound_DIDDocument",
      },
    },
  },
};
