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