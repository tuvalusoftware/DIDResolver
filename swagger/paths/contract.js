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
                  description: "This is a contract",
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
                  isValid: true,
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
