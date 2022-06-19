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
        example: "did:method:Kukulu:file_name",
        // default: "did:method:giabuynh:srs"
      },
      {
        in: "query",
        name: "only",
        type: "string",
        require: false,
        description: "Optional parameter to receive DID document and/or wrapped document.",
        examples: {
          "empty": {
            "value": "",
            "summary": "'' or undefined for receiving both DID document and wrapped document"
          },
          "did": {
            "value": "did",
            "summary": "'did' for receiving DID document only."
          },
          "doc": {
            "value": "doc",
            "summary": "'doc' for receiving wrapped document only."
          }
        }
      }
    ],
    responses: {
      200: {
        description: "Return documents.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                didDoc: {
                  $ref: "#components/schemas/didDocumentOfWrappedDocument",
                },
                wrappedDoc: {
                  $ref: "#components/schemas/wrappedDocument",
                }
              }
            }
          }
        },
      },
      400: {
        $ref: "#/components/responses/BadRequest"
      },
      404: {
        description: "Not found. DID document or/and wrapped document are not found.",
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
        example: "file_name"
      },
      {
        in: "header",
        name: "companyName",
        type: "string",
        require: true,
        description: "Name of company.",
        example: "Kukulu"
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
        $ref: "#/components/responses/BadRequest"
      }
    }
  }
}

module.exports.createWrappedDocument = {
  post: {
    tags: ["Wrapped document"],
    summary: "Receive and valiate wrapped document from dApp and call services to hash and store data.",
    parameters: [
      {
        in: "cookie",
        name: "access_token",
        type: "string",
        require: true,
        description: "Access token of current user",
        // default: "did:method:Kukulu:public_key",
      }
    ],
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              wrappedDocument: {
                $ref: "#/components/schemas/wrappedDocument"
              },
              issuerAddress: {
                type: "string",
                example: "???"
              },
              did: {
                type: "string",
                example: ""
              }
            }
          }
        }
      }
    },
    responses: {
      201: {
        description: "Created. New wrapped document is successfully created.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/wrappedDocument"
            }
          }
        }
      },
      400: {
        $ref: "#/components/responses/BadRequest"
      },
      401: {
        description: "Unauthorized. Cannot verify user with the given access token.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Unauthorized."
            }
          },
          "application/json": {

          }
        }
      }
    }
  },
}

module.exports.updateWrappedDocument = {
  put: {
    tags: ["Wrapped document"],
    summary: "",
    requestBody: {

    },
    responses: {

    }
  }
}

module.exports.validateWrappedDocument = {

}
