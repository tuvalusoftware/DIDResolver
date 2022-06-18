module.exports.getWrappedDocument = {
  get: {
    tags: ["Wrapped document"],
    summary: "Get wrapped document and/or its DID document by a given DID.",
    parameters: [
      {
        in: "header",
        name: "did",
        type: "string",
        require: true,
        description: "DID string. Syntax: did:method:companyName:publicKey.",
        example: "did:method:companyName:fileName",
        // default: "did:method:giabuynh:srs"
      },
      {
        in: "query",
        name: "exclude",
        type: "string",
        require: false,
        description: "Optional parameter to receive DID document and/or wrapped document.",
        example: "'did' for receiving wrapped document onely. 'doc' for receiving DID document only. '' or undefined for receiving both DID document and wrapped document.",
        // default: ""
      }
    ],
    responses: {
      200: {
        description: "Return documents.",
        content: {
          "application/json": {
            schema: {
              $ref: "#components/schemas/wrappedDocument",
              // oneOf: {
              //   $ref: "#/components/schemas/didDocumentOfWrappedDocument",
              //   $ref: "#/components/schemas/wrappedDocument",
              // }
              // type: "object",
              // propeties: {
              //   wrapDoc: {
              //     type: "object"
              //   },
              //   didDoc: {
              //     type: "object"
              //   }
              // },
              // example: {
              //   "wrapDoc": {},
              //   "didDoc": {}
              // }
            }
          }
        },
      },
      400: {
        description: "Bad request. Input DID is invalid or undefined.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Missing parameters."
            }
          },
          "application/json": {
            schema: {
              type: "object",
              example: {}
            }
          }
        }
      },
      404: {
        description: "Not found. DID document or/and wrapped document are not found.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "File/Public Key with the given value cannot be found."
            }
          }
        }
      }
    }
  }
}

module.exports.checkWrappedDocumentExistence = {
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
          "text/plain": {
            schema: {
              type: "boolean"
            }
          }
        }
      },
      400: {
        description: "Bad request.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Missing parameters."
            }
          },
          "application/json": {
            schema: {
              type: "object",
              properties: {

              }
            }
          }
        }
      }
    }
  }
}

module.exports.createWrappedDocument = {
  post: {
    tags: ["Wrapped document"],
    summary: "Receive and valiate wrapped document from dApp and call services to hash and store data.",
    // parameters: [],
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {

            }
          }
        }
      }
    },
    responses: {
      200: {
        description: "OK.",
        content: {

        }
      },
      400: {
        description: "Bad request.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Missing parameters."
            }
          },
          "application/json": {
            schema: {
              type: "object",
              properties: {

              }
            }
          }
        }
      }
    }
  }
}