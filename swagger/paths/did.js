export const retrieveSpecificDid = {
  get: {
    tags: ["User DID"],
    summary:
      "Get specific DID of user depend on name of company, and public key of user",
    parameters: [
      {
        name: "companyName",
        in: "query",
        description: "Name of company",
        required: true,
        example: "PAPERLESS_COMPANY2",
        schema: {
          type: "string",
        },
      },
      {
        name: "publicKey",
        in: "query",
        description: "Encoded public key user which you want to get DID",
        example:
          "0023e378c9887a9b3f2c12de7807799ab0095f24ac8d2f61c0cccdf98959cf25683106fa3cffe914fdf0fed1a668121acf20b1911de254f572",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "",
        content: {
          "application/json": {
            examples: {
              success: {
                description: "Return object of user did",
                value: {
                  name: "encoded public-key",
                  content: {
                    controller: "encoded public-key",
                    did: "did of user",
                    data: {
                      name: "name of user",
                      organizationName: "name of organization",
                      organizationMail: "mail of organization",
                      organizationPhoneNumber: "phone number of organization",
                      organizationAddress: "address of organization",
                      website: "website linke of organization",
                      issuer: "is the user is issuer",
                      address: "encoded public-key",
                    },
                  },
                },
              },
              not_found: {
                description: "Return object of error",
                value: {
                  error_code: 20002,
                  error_message:
                    "File/Public Key with the given value cannot be found.",
                },
              },
            },
          },
        },
      },
    },
  },
  post: {
    tags: ["User DID"],
    summary:
      "Create user DID for given name of company, encoded public-key of user, did of user, and content",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              companyName: {
                required: true,
                type: "string",
                example: "PAPERLESS_COMPANY2",
              },
              publicKey: {
                required: true,
                type: "string",
                example: "user's public key",
              },
              did: {
                required: true,
                type: "string",
                example: "did:fuixlabs:companyName:publicKey",
              },
              data: {
                required: true,
                type: "object",
                example: {
                  name: "Jone Sad",
                  organizationName: "organizationName1",
                  organizationMail: "organizationMail1",
                  organizationPhoneNumber: "organizationPhoneNumber1",
                  organizationAddress: "organizationAddress1",
                  website: "https://johnsad.com",
                  issuer: "true",
                },
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "",
        content: {
          "application/json": {
            examples: {
              success: {
                value: "Successfully saved!",
              },
              error: {
                description: "Return object of error",
                value: {
                  error_code: "code of error",
                  error_message: "Error message",
                },
              },
            },
          },
        },
      },
    },
  },
  delete: {
    tags: ["User DID"],
    summary:
      "Delete user DID for given name of company, and encoded public-key of user",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              companyName: {
                required: true,
                type: "string",
                example: "PAPERLESS_COMPANY2",
              },
              publicKey: {
                required: true,
                type: "string",
                example: "user's public key",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "",
        content: {
          "application/json": {
            examples: {
              success: {
                value: "Successfully deleted!",
              },
              error: {
                description: "Return object of error",
                value: {
                  error_code: "code of error",
                  error_message: "Error message",
                },
              },
            },
          },
        },
      },
    },
  },
  put: {
    tags: ["User DID"],
    summary:
      "Update user DID for given name of company, encoded public-key of user, did of user, and content",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              companyName: {
                required: true,
                type: "string",
                example: "PAPERLESS_COMPANY2",
              },
              publicKey: {
                required: true,
                type: "string",
                example: "user's public key",
              },
              did: {
                required: true,
                type: "string",
                example: "did:fuixlabs:companyName:publicKey",
              },
              data: {
                required: true,
                type: "object",
                example: {
                  name: "Jone Sad",
                  organizationName: "organizationName1",
                  organizationMail: "organizationMail1",
                  organizationPhoneNumber: "organizationPhoneNumber1",
                  organizationAddress: "organizationAddress1",
                  website: "https://johnsad.com",
                  issuer: "true",
                },
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "",
        content: {
          "application/json": {
            examples: {
              success: {
                value: "Successfully saved!",
              },
              error: {
                description: "Return object of error",
                value: {
                  error_code: "code of error",
                  error_message: "Error message",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const retrieveAllDids = {
  get: {
    tags: ["User DID"],
    summary: "Get all DIDs of specific company depend on name of company",
    parameters: [
      {
        name: "companyName",
        in: "query",
        description: "Name of company",
        required: true,
        example: "PAPERLESS_COMPANY2",
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "",
        content: {
          "application/json": {
            examples: {
              success: {
                description: "Return array of objects of users did",
                value: [
                  {
                    name: "00dfe16d2c2d6719688956f0bcff7a00b99ab5e671d9d898b4d705a936b311d7c62d4fa276203b1bb18005389a0ab83687572aab209b41af6a",
                    content: {
                      controller:
                        "00dfe16d2c2d6719688956f0bcff7a00b99ab5e671d9d898b4d705a936b311d7c62d4fa276203b1bb18005389a0ab83687572aab209b41af6a",
                      did: "did:fuixlabs:PAPERLESS_COMPANY2:00dfe16d2c2d6719688956f0bcff7a00b99ab5e671d9d898b4d705a936b311d7c62d4fa276203b1bb18005389a0ab83687572aab209b41af6a",
                      data: {
                        name: "Huynh Quan Nhat Hao",
                        organizationName: "organizationName1",
                        organizationMail: "organizationMail1",
                        organizationPhoneNumber: "organizationPhoneNumber1",
                        organizationAddress: "organizationAddress1",
                        website: "https://www.sc.com/en/",
                        issuer: "true",
                        address:
                          "00dfe16d2c2d6719688956f0bcff7a00b99ab5e671d9d898b4d705a936b311d7c62d4fa276203b1bb18005389a0ab83687572aab209b41af6a",
                      },
                    },
                  },
                ],
              },
              not_found: {
                description: "Return object of error",
                value: {
                  error_code: 20000,
                  error_message: "Company with the given name cannot be found.",
                },
              },
            },
          },
        },
      },
    },
  },
};
