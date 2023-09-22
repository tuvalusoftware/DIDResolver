export const contract = {
  post: {
    tags: ["Commonlands Contract"],
    summary: "Create a new contract",
    description: "Create a new contract",
    operationId: "createContract",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: {
                type: "object",
                example: {
                  url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                },
              },
              id: {
                type: "string",
                example: "sample_id_1",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "return a object include url of contract",
        content: {
          "application/json": {
            examples: {
              "Missing parameters": {
                value: {
                  error_code: 400,
                  message: "Missing parameters",
                  detail: "Not found: content",
                },
              },
              "Create contract success": {
                value: {
                  url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                  path: "1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                  message: "Create document Successfully",
                },
              },
              "Document already exists": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Document already exists.",
                },
              },
              "Cannot get document information": {
                value: {
                  error_code: 400,
                  error_message:
                    "Bad request. Cannot get document information.",
                },
              },
              "Error while creating PDF": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Error while creating PDF.",
                },
              },
            },
          },
        },
      },
    },
  },
  get: {
    tags: ["Commonlands Contract"],
    summary: "Get a contract",
    description: "Get a contract",
    operationId: "getContract",
    parameters: [
      {
        name: "did",
        in: "query",
        description: "DID of contract",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "return a object include url of contract",
        content: {
          "application/json": {
            examples: {
              "Get contract success": {
                value: {
                  description: "This is a contract",
                  fileName: "Contract-sample_id_11",
                  name: "Commonlands Contract",
                  companyName: "COMMONLANDS_2",
                  intention: "trade",
                  did: "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_11",
                  issuers: [
                    {
                      identityProofType: {
                        type: "DID",
                        did: "did:fuixlabs:COMMONLANDS_2:00f6eeddadb8e07074d189629b43df0dd913c3d3087e7f00ccf58f98f149abe31f60b335bae8ca10853ab35cc2ee332c850dee261af01bc287",
                      },
                      address:
                        "00f6eeddadb8e07074d189629b43df0dd913c3d3087e7f00ccf58f98f149abe31f60b335bae8ca10853ab35cc2ee332c850dee261af01bc287",
                    },
                  ],
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  message: "Missing parameters",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const verifyContract = {
  post: {
    tags: ["Commonlands Contract"],
    summary: "Verify a contract",
    description: "",
    operationId: "verifyContract",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                example:
                  "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
              },
            },
          },
        },
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "return a object include url of contract",
        content: {
          "application/json": {
            examples: {
              "Missing parameters": {
                value: {
                  error_code: 400,
                  message: "Missing parameters",
                },
              },
              "Contract is not valid": {
                value: {
                  error_code: 400,
                  error_message: "Contract is not valid!",
                },
              },
              "Contract is valid": {
                value: {
                  isValid: true,
                },
              },
            },
          },
        },
      },
    },
  },
};

export const checkBlockStatus = {
  post: {
    tags: ["Commonlands Contract"],
    summary: "Check status of block contract",
    description: "",
    operationId: "checkBlockStatus",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              did: {
                type: "string",
                example: "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_11",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return a object include status of block contract",
        content: {
          "application/json": {
            examples: {
              "Contract is blocked": {
                value: {
                  isBlocked: true,
                },
              },
              "Contract is not blocked": {
                value: {
                  isBlocked: false,
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  message: "Missing parameters",
                  detail: "Not found: did",
                },
              },
              "Invalid DID": {
                value: {
                  error_code: 400,
                  message: "Invalid DID",
                },
              },
              "Cannot get document information": {
                value: {
                  error_code: 400,
                  message: "Cannot get document information",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const blockContract = {
  post: {
    tags: ["Commonlands Contract"],
    summary: "Block a contract",
    description: "",
    operationId: "blockContract",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              did: {
                type: "string",
                example: "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_11",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return a object include status of block contract",
        content: {
          "application/json": {
            examples: {
              "Block contract success": {
                value: {
                  message:
                    "Block contract did:fuixlabs:COMMONLANDS_2:Contract-sample_id_11 successfully",
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  message: "Missing parameters",
                  detail: "Not found: did",
                },
              },
              "Invalid DID": {
                value: {
                  error_code: 400,
                  message: "Invalid DID",
                },
              },
              "Cannot get document information": {
                value: {
                  error_code: 400,
                  message: "Cannot get document information",
                },
              },
            },
          },
        },
      },
    },
  },
};
