export const createAlgorandCredential = {
  post: {
    tags: ["Algorand"],
    summary:
      "Create credential for endorsing/changing/nominating ownership or holdership on Algorand network.",
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
                type: "object",
                $ref: "#/components/schemas/credential",
              },
              config: {
                type: "object",
                $ref: "#/components/schemas/algorandMintingNFTConfig",
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

export const getAlgorandNFTs = {
  get: {
    tags: ["Algorand"],
    summary:
      "Get list of transactions from Algorand service depend on unit-name or asset-id",
    parameters: [
      {
        in: "query",
        name: "unitName",
        require: false,
        description: "unit-name of transactions chain",
      },
      {
        in: "query",
        require: false,
        name: "assetId",
        description: "asset-id of specific transaction",
      },
    ],
    responses: {
      200: {
        description: "",
        content: {
          "application/json": {
            example: {
              assets: [
                {
                  "created-at-round": 26538005,
                  deleted: false,
                  index: 150575547,
                  params: {
                    clawback:
                      "3OFBQRUT4PAFOL4AGT3E7T4N3DZ2WT6GQHNENDOXA24A74SIDCUP5L2M3M",
                    creator:
                      "3OFBQRUT4PAFOL4AGT3E7T4N3DZ2WT6GQHNENDOXA24A74SIDCUP5L2M3M",
                    decimals: 0,
                    "default-frozen": false,
                  },
                  metadata: {
                    version: 0,
                    attach:
                      "f75bd6e59e46f17ebf7c9beb6636c9f6edcdcc49cccb09f8a0dfd02a577b6d28",
                    timestamp: 1672049153416,
                    type: "document",
                    previous:
                      "f75bd6e59e46f17ebf7c9beb6636c9f6edcdcc49cccb09f8a0dfd02a577b6d28",
                    root: "f75bd6e59e46f17ebf7c9beb6636c9f6edcdcc49cccb09f8a0dfd02a577b6d28",
                  },
                  assetName: "b0b7936318ce866382e7da84749af28a",
                  assetId: 150575547,
                  unitName: "9b1e1d68",
                  txId: "PCZCJOWGRQRXP4ST76KCB66GF24Q5JRTU66G247ZC6JQ2PO2G54A",
                },
              ],
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/error" },
            examples: {
              "Missing parameters": {
                $ref: "#/components/examples/errorMissingParameters",
              },
            },
          },
        },
      },
      401: { $ref: "#/components/responses/Unauthorized" },
    },
  },
};

export const verifyAlgorandAddress = {
  get: {
    tags: ['Algorand'],
    summary: 'Check if given address is a valid address on Algorand network',
    parameters: [
      {
        in: "query",
        name: "address",
        require: true,
        description: 'Given address'
      }
    ],
    responses: {
      200: {
        description: '',
        content: {
          'application/json': {
            example: {
              isValid: true
            }
          }
        }
      },
      400: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/error" },
            examples: {
              "Missing parameters": {
                $ref: "#/components/examples/errorMissingParameters",
              },
            },
          },
        },
      },
      401: { $ref: "#/components/responses/Unauthorized" },
    }
  }
}

export const verifyAlgorandHash = {
  post: {
    tags: ["Algorand"],
    summary: "check if transaction hash exists on Algorand network",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              assetId: {
                type: "string",
                example: "150575850",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description:
          "returns the isValid field representing the authenticity of the assetId on the Algorand service",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                isValid: {
                  type: "boolean",
                  example: "true",
                },
              },
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/error" },
            examples: {
              "Missing parameters": {
                $ref: "#/components/examples/errorMissingParameters",
              },
            },
          },
        },
      },
      401: { $ref: "#/components/responses/Unauthorized" },
    },
  },
};

export const verifyAlgorandSignature = {
  post: {
    tags: ["Algorand"],
    summary:
      "Check the given signature whether the signed content is valid or not",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                require: true,
                example:
                  "KOWRYYQTEOKT5WSXIGWE6QPGAHX4SS3JEZ3ASIQ74GGWPOXJRMEPVHLWAM",
              },
              payload: {
                type: "object",
                require: true,
              },
              signature: {
                type: "string",
                require: true,
                example:
                  "BZ3lZ3391EYB8vAGJiQmMTvSHzgg8qKQh7N2xbPNJzSOrg/ddChoAgSglt7yYZBx5X8TrCh/BGkAQkPm56DICw==",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description:
          "returns the isValid field representing the authenticity of the given signature on the Algorand service",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                isValid: {
                  type: "boolean",
                  example: "true",
                },
              },
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/error" },
            examples: {
              "Missing parameters": {
                $ref: "#/components/examples/errorMissingParameters",
              },
            },
          },
        },
      },
      401: { $ref: "#/components/responses/Unauthorized" },
    },
  },
};

export const algorandDocument = {
  post: {
    tags: ['Algorand'],
    summary: "Create new wrapped document on Algorand network",
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object', 
            properties: {
              wrappedDocument: {
                type: 'object',
                description: "content of document what user want to create",
                require: true
              },
              issuerAddress: {
                type: 'string',
                require: true,
                description: 'Address of user who create this document',
                example: 'KOWRYYQTEOKT5WSXIGWE6QPGAHX4SS3JEZ3ASIQ74GGWPOXJRMEPVHLWAM'
              },
              mintingNFTConfig: {
                type: 'object',
                require: true,
                description: 'Config of previous document got from Algorand service'
              }
            }
          }
        }
      },
    },
    responses: {
      200: {
        description: "Return documents.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              $ref: "#/components/schemas/wrappedDocument"
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
      404: {
        $ref: "#/components/responses/NotFound_DIDDocument",
      },
    },
  },
  delete: {
    tags: ["Algorand"],
    summary: "Revoke a wrapped document on Algorand network.",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              config: { $ref: "#/components/schemas/algorandMintingNFTConfig" },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully revoke document",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "integer", example: 0 },
                message: { type: "string", example: "SUCCESS" },
            },
          },
        },
      }},
      401: {
        description: "Cannot verify user with the given access token.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Unauthorized.",
            },
          },
        },
      },
    },
  },
}
