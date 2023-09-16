export const createCredential = {
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

export const getCredential = {
  get: {
    description: "Get credential by hash.",
    tags: ["Commonlands Credential"],
    summary: "Get credential by hash.",
    parameters: [
      {
        in: "path",
        name: "credentialHash",
        schema: {
          type: "string",
          example:
            "cba29dd3e46b3db49cccdb0decd649f23fdfc1f396694b45fa91a30972550d05",
        },
        required: true,
        description: "Credential hash",
      },
    ],
    responses: {
      200: {
        description: "Credential is successfully retrieved.",
        content: {
          "application/json": {
            examples: {
              "Get credential successfully": {
                value: {
                  issuer:
                    "did:fuixlabs:COMMONLANDS_2:did:fuixlabs:COMMONLANDS_2:Contract-sample_id_12",
                  credentialSubject: {
                    object: "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_12",
                    action: {
                      code: 1,
                    },
                  },
                  signature: {
                    key: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                    signature: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                  },
                  metadata: {
                    name: "Land Certificate",
                    description: "Land Certificate for the Commonlands Project",
                  },
                  timestamp: 1694765692908,
                  mintingNFTConfig: {
                    type: "credential",
                    policy: {
                      type: "Native",
                      script:
                        "8201828200581c4b3230ba5b12fffd92edd7aea44b6bebbcdf57ef7fe262760a3722ee82051abe4c77ff",
                      ttl: 3192682495,
                      id: "7cdf45d163f394bf5ab2629f2708a02b738c1785f59ba7a94dec4267",
                    },
                    asset:
                      "7cdf45d163f394bf5ab2629f2708a02b738c1785f59ba7a94dec4267cba29dd3e46b3db49cccdb0decd649f23fdfc1f396694b45fa91a30972550d05",
                    txHash:
                      "5d8c3970bae374213f5330b926a722e3c5e0a7d76ce787bb0e2fc087884298b7",
                  },
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  error_message: "Missing parameters!",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getAllCredentialsOfContract = {
  get: {
    tags: ["Commonlands Credential"],
    summary: "Get all credentials of a contract.",
    parameters: [
      {
        in: "path",
        name: "contractId",
        schema: {
          type: "string",
          example:
            "did:method:Kukulu:0x1234567890abcdef1234567890abcdef12345678",
        },
        required: true,
        description: "Contract address",
      },
    ],
    responses: {
      200: {
        description:
          "All credentials of a contract are successfully retrieved.",
        content: {
          "application/json": {
            examples: {
              "Get credentials of a contract successfully": {
                value: [
                  {
                    issuer:
                      "did:fuixlabs:COMMONLANDS_2:did:fuixlabs:COMMONLANDS_2:Contract-sample_id_12",
                    credentialSubject: {
                      object:
                        "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_12",
                      action: {
                        code: 1,
                      },
                    },
                    signature: {
                      key: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                      signature: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                    },
                    metadata: {
                      name: "Land Certificate",
                      description:
                        "Land Certificate for the Commonlands Project",
                    },
                    timestamp: 1694765692908,
                    mintingNFTConfig: {
                      type: "credential",
                      policy: {
                        type: "Native",
                        script:
                          "8201828200581c4b3230ba5b12fffd92edd7aea44b6bebbcdf57ef7fe262760a3722ee82051abe4c77ff",
                        ttl: 3192682495,
                        id: "7cdf45d163f394bf5ab2629f2708a02b738c1785f59ba7a94dec4267",
                      },
                      asset:
                        "7cdf45d163f394bf5ab2629f2708a02b738c1785f59ba7a94dec4267cba29dd3e46b3db49cccdb0decd649f23fdfc1f396694b45fa91a30972550d05",
                      txHash:
                        "5d8c3970bae374213f5330b926a722e3c5e0a7d76ce787bb0e2fc087884298b7",
                    },
                    hash: "cba29dd3e46b3db49cccdb0decd649f23fdfc1f396694b45fa91a30972550d05",
                  },
                  {
                    issuer:
                      "did:fuixlabs:COMMONLANDS_2:did:fuixlabs:COMMONLANDS_2:Contract-sample_id_12",
                    credentialSubject: {
                      object:
                        "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_12",
                      action: {
                        code: 1,
                      },
                    },
                    signature: {
                      key: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                      signature: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                    },
                    metadata: {
                      name: "Land Certificate",
                      description:
                        "Land Certificate for the Commonlands Project",
                    },
                    timestamp: 1694766951681,
                    mintingNFTConfig: {
                      type: "credential",
                      policy: {
                        type: "Native",
                        script:
                          "8201828200581c4b3230ba5b12fffd92edd7aea44b6bebbcdf57ef7fe262760a3722ee82051abe4c7ce8",
                        ttl: 3192683752,
                        id: "bf4a3770d1d290e1597593656e597b0c5515a214d5ef35e4d73407eb",
                      },
                      asset:
                        "bf4a3770d1d290e1597593656e597b0c5515a214d5ef35e4d73407eb94a7b8de07da3a47a17533a780fb616859ad1d4dd0ca813affcbd22e2c74e114",
                      txHash:
                        "23c43d9b337a10487dd22196d8b5d37467320d45c90bab841200ed1fd744c626",
                    },
                    hash: "94a7b8de07da3a47a17533a780fb616859ad1d4dd0ca813affcbd22e2c74e114",
                  },
                ],
              },
              "No credential found for given contract did": {
                value: {
                  error_code: 400,
                  error_message:
                    "There are no credentials rely on this contract!",
                },
              },
              "Cannot get document information": {
                value: {
                  error_code: 400,
                  error_message: "Cannot get document information!",
                },
              },
              "Invalid DID syntax": {
                value: {
                  error_code: 400,
                  error_message: "Invalid DID syntax!",
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  error_message: "Missing parameters!",
                },
              },
            },
          },
        },
      },
    },
  },
};
