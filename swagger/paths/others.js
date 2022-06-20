
module.exports.getNFTs = {
  get: {
    tags: ["Others"],
    summary: "",
    parameters: [
      {
        in: "cookie",
        name: "access_token",
        type: "string",
        require: true,
        description: "Access token of current user.",
        // default: "did:method:Kukulu:public_key",
        // example: "did:method:companyName:publicKey",
      },
      {
        in: "header",
        name: "policyId",
        type: "string",
        require: true,
        description: "Policy Id",
        // default: "did:method:Kukulu:public_key",
        // example: "did:method:companyName:publicKey",
      }
    ],
    responses: {
      200: {
        description: "OK.",
        content: {
          "application/json": {
            example: {
              "nfts": [
                {
                  "unit": "199062e26a0ea1370249e71e6224c6541e7825a192fe42c57aa538c341616461476f6c64656e526566657272616c31363339303438343435",
                  "quantity": 1
                }
              ]
            }
          }
        }
      },
      400: {
        description: "",
        content: {
          "application/json": {
            example: {
              errorCode: 400,
              errorMessage: "Bad request. Missing parameters.",
              detail: ""
            }
          }
        }
      },
      401: {
        description: "Cannot verify user with the given access token.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Unauthorized."
            }
          }
        }
      }
    }
  }
}


module.exports.verifyHash = {
  get: {
    tags: ["DID document"],
    summary: "Resolve DID - Takes a DID of a company or user as input and produces a conforming DID document as output.",
    parameters: [
      {
        in: "header",
        name: "did",
        type: "string",
        require: true,
        description: "DID string. Syntax: did:method:companyName:publicKey.",
        default: "did:method:Kukulu:public_key",
        // example: "did:method:companyName:publicKey",
      }
    ],
    responses: {
      200: {
        description: "OK. Return a conforming DID document.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/didDocument"
            },
          }
        }
      },
      400: {
        $ref: "#/components/responses/BadRequest"
      },
      404: {
        description: "Not found. Cannot found DID document with a companyName and publicKey included in the given DID string.",
        content: {
          "application/json": {
            example: {
              errorCode: 404,
              message: "File/Public Key with the given value cannot be found."
            }
          }
        }
      }
    }
  }
}

module.exports.verifySignature = {
  get: {
    tags: ["DID document"],
    summary: "Create DID document for a given DID string of a company/user.",
    parameters: [],
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
              didDocument: {
                $ref: "#/components/schemas/didDocument"
              }
            }
          },
        }
      }
    },
    responses: {
      201: {
        description: "Created. New DID document is successfully created.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "DID Document created."
            }
          }
        }
      },
      400: {
        $ref: "#/components/responses/BadRequest"
      }
    }
  }
}