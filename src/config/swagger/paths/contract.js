import { ERRORS } from "../../errors/error.constants.js";

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
                  hash: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
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

export const assignCredentialToContract = {
  post: {
    tags: ["Commonlands Contract"],
    summary: "Lock certificate to a loan contract",
    description: "",
    operationId: "assignCredentialToContract",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              contractDid: {
                type: "string",
                example: "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_11",
              },
              signData: {
                type: "object",
                example: {
                  signature:
                    "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f",
                  key: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
                },
              },
              issuerKey: {
                type: "string",
                example:
                  "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
              },
              metadata: {
                type: "object",
                example: {
                  content: "Metadata of contract",
                },
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
              "Assign credential to contract success": {
                value: {
                  success: true,
                  success_message: "Credential is created successfully!",
                  credentialHash:
                    "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
                },
              },
              "Missing parameters": {
                value: { ...ERRORS.MISSING_PARAMETERS, detail: "signData" },
              },
              "Metadata of Request body is not valid": {
                value: {
                  ...ERRORS.INVALID_INPUT,
                  detail:
                    "Metadata field is invalid! Make sure you have all required fields!",
                },
              },
              "Certificate was assigned to antoher contract": {
                value: ERRORS.CERTIFICATE_DID_IS_LOCKED_WITH_CONTRACT,
              },
              "Invalid DID": {
                value: ERRORS.INVALID_DID,
              },
              "Cannot get document information": {
                value: ERRORS.CANNOT_GET_DOCUMENT_INFORMATION,
              },
            },
          },
        },
      },
    },
  },
  delete: {
    tags: ["Commonlands Contract"],
    summary: "Unlock credential from a loan contract",
    description: "",
    operationId: "unlockCredentialFromContract",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              certificateDid: {
                type: "string",
                example: "did:fuixlabs:COMMONLANDS_2:Certificate-sample_id_11",
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
              "Unlock credential from contract success": {
                value: {
                  success: true,
                  success_message: "Credential is unlocked successfully!",
                },
              },
              "Missing parameters": {
                value: { ...ERRORS.MISSING_PARAMETERS, detail: "signData" },
              },
              "Invalid DID": {
                value: ERRORS.INVALID_DID,
              },
              "Cannot get document information": {
                value: ERRORS.CANNOT_GET_DOCUMENT_INFORMATION,
              },
            },
          },
        },
      },
    },
  },
};

export const checkLockedStatus = {
  get: {
    tags: ["Commonlands Contract"],
    summary: "Get locked status of a certificate",
    description: "",
    operationId: "getLockedStatus",
    parameters: [
      {
        name: "certificateDid",
        in: "query",
        description: "DID of certificate",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Return a object include status of block contract",
        content: {
          "application/json": {
            examples: {
              "Certificate is locked": {
                value: {
                  success: true,
                  isLocked: true,
                  lockedWithContract:
                    "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_11",
                },
              },
              "Certificate is not locked": {
                value: {
                  success: true,
                  isLocked: false,
                },
              },
              "Missing parameters": {
                value: {
                  ...ERRORS.MISSING_PARAMETERS,
                  detail: "Not found: did",
                },
              },
              "Invalid DID": {
                value: ERRORS.INVALID_DID,
              },
              "Cannot get document information": {
                value: ERRORS.CANNOT_GET_DOCUMENT_INFORMATION,
              },
            },
          },
        },
      },
    },
  },
};
