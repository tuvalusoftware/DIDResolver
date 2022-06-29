const { example } = require("../schemas/didDocument");

module.exports.createCredential = {
  // post: {
  //   tags: ["Credential"],
  //   summary: "Create credential for endorsing/changing/nominating ownership or holdership.",
  //   parameters: [
  //     {
  //       in: "cookie",
  //       name: "access_token",
  //       type: "string",
  //       require: true,
  //       description: "Access token of current user",
  //     }
  //   ],
  //   requestBody: {
  //     required: true,
  //     content: {
  //       "application/json": {
  //         schema: {
  //           type: "object",
  //           properties: {
  //             did: {
  //               type: "string",
  //               example: "did:method:Kukulu:public_key"
  //             },
  //             address: {
  //               type: "string",
  //               example: "00d86a5efcde8c4129755d0d43b0fd87622a260d45b33bc04140772a532d14a4e1198cebde34e68f82b94f5068de44aa580ebf66cfaaef0698"
  //             },
  //             payload: {
  //               type: "string",
  //               example: "7b0a202020202272616e646f6d4e756d626572223a20302e393439343136373338343132363330362c0a202020202274696d657374616d70223a20313635333435313134393334380a7d"
  //             },
  //             credential: {
  //               $ref: "#/components/schemas/credential"
  //             }
  //           }
  //         },
  //       }
  //     }
  //   },
  //   responses: {
  //     201: {
  //       description: "New credential is successfully created.",
  //       content: {
  //         "text/plain": {
  //           schema: {
  //             type: "string",
  //             example: "Credential created."
  //           }
  //         }
  //       }
  //     },
  //     400: {
  //       description: "Missing parameters or invalid input",
  //       content: {
  //         "application/json": {
  //           schema: { $ref: "#/components/schemas/error" },
  //           examples: {
  //             "Missing parameters": { $ref: "#/components/examples/errorMissingParameters" },
  //             "Invalid input": { $ref: "#/components/examples/errorInvalidInput" }
  //           }
  //         }
  //       }
  //     },
  //     401: {
  //       $ref: "#/components/responses/Unauthorized"
  //     },
  //     403: {
  //       description: "Signature cannot be verified",
  //       content: {
  //         "application/json": {
  //           schema: { $ref: "#/components/schemas/error" },
  //           examples: {
  //             "Unverified signature": { $ref: "#/components/examples/errorUnverifiedSignature" }
  //           }
  //         }
  //       }
  //     },
  //     404: {
  //       $ref: "#/components/responses/NotFound_DIDDocument"
  //     }
  //   }
  // }
  post: {
    tags: ["Credential"],
    summary: "Create credential for endorsing/changing/nominating ownership or holdership.",
    parameters: [
      {
        in: "cookie",
        name: "access_token",
        type: "string",
        require: true,
        description: "Access token of current user",
      }
    ],
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
              address: {
                type: "string",
                example: "00d86a5efcde8c4129755d0d43b0fd87622a260d45b33bc04140772a532d14a4e1198cebde34e68f82b94f5068de44aa580ebf66cfaaef0698"
              },
              payload: {
                type: "string",
                example: "7b0a202020202272616e646f6d4e756d626572223a20302e393439343136373338343132363330362c0a202020202274696d657374616d70223a20313635333435313134393334380a7d"
              },
              credential: {
                $ref: "#/components/schemas/credential"
              }
            }
          },
        }
      }
    },
    responses: {
      201: {
        description: "New credential is successfully created.",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Credential created."
            }
          }
        }
      },
      400: {
        description: "Missing parameters or invalid input",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/error" },
            examples: {
              "Missing parameters": { $ref: "#/components/examples/errorMissingParameters" },
              "Invalid input": { $ref: "#/components/examples/errorInvalidInput" }
            }
          }
        }
      },
      401: {
        $ref: "#/components/responses/Unauthorized"
      },
      403: {
        description: "Signature cannot be verified",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/error" },
            examples: {
              "Unverified signature": { $ref: "#/components/examples/errorUnverifiedSignature" }
            }
          }
        }
      },
      404: {
        $ref: "#/components/responses/NotFound_DIDDocument"
      }
    }
  }
}