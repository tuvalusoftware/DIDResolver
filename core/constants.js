const HOST = "http://18.139.84.180";
const LOCAL_HOST = "http://localhost"

module.exports.SERVERS = {
  DID_CONTROLLER: `${HOST}:9000`,
  CARDANO_SERVICE: `${HOST}:10000`,
  AUTHENTICATION_SERVICE: `${HOST}:12000`,
}

module.exports.ERRORS = {
  MISSING_PARAMETERS: {
    errorCode: 400,
    errorMessage: "Bad request. Missing parameters."
  },
  INVALID_INPUT: {
    errorCode: 400,
    errorMessage: "Bad request. Invalid input syntax."
  },
  UNAUTHORIZED: {
    errorCode: 401,
    errorMessage: "Unauthorized. Access token is invalid."
  },
  PERMISSION_DENIED: {
    errorCode: 403,
    errorMessage: "Forbidden. Permission denied."
  },
  NOT_FOUND: {
    errorCode: 404,
    errorMessage: "Not found. Resource is not found."
  },
  ALREADY_EXSISTED: {
    errorCode: 409,
    errorMessage: "Conflict. Resource already exsited."
  },
  CANNOT_MINT_NFT: {
    errorCode: 500,
    errorMessage: "Error. Cannot mint NFT."
  },
  CANNOT_FETCH_NFT: {
    errorCode: 400,
    errorMessage: "Bad request. Cannot fetch NFT metadata. Check your assetId or policyId."
  }
}

module.exports.SHEMAS = {
  NEW_WRAPPED_DOCUMENT: {
    type: "object",
    required: ["data", "signature"],
    properties: {
      vesion: { type: "string" },
      data: {
        type: "object",
        required: ["did", "issuers"],
        properties: {
          file: { type: "string" },
          name: { type: "string" },
          title: { type: "string" },
          companyName: { type: "string" },
          did: { type: "string" },
          issuers: {
            type: "array",
            items: {
              type: "object",
              required: ["address"],
              properties: {
                identityProofType: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    location: { type: "string" }
                  }
                },
                did: { type: "string" },
                address: { type: "string" }
              }
            }
          }
        }
      },
      signature: {
        type: "object",
        required: ["targetHash"],
        properties: {
          type: { type: "string" },
          targetHash: { type: "string" },
          proof: { type: "array" },
          merkleRoot: { type: "string" }
        }
      },
    }
  },

  WRAPPED_DOCUMENT: {
    type: "object",
    required: ["data", "signature", "assetId", "policyId"],
    properties: {
      vesion: { type: "string" },
      data: {
        type: "object",
        required: ["did", "issuers"],
        properties: {
          file: { type: "string" },
          name: { type: "string" },
          title: { type: "string" },
          companyName: { type: "string" },
          did: { type: "string" },
          issuers: {
            type: "array",
            items: {
              type: "object",
              required: ["address"],
              properties: {
                identityProofType: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    location: { type: "string" }
                  }
                },
                did: { type: "string" },
                address: { type: "string" }
              }
            }
          }
        }
      },
      signature: {
        type: "object",
        required: ["targetHash"],
        properties: {
          type: { type: "string" },
          targetHash: { type: "string" },
          proof: { type: "array" },
          merkleRoot: { type: "string" }
        }
      },
      assertId: { type: "string" },
      policyId: { type: "string" },
    }
  },

  CREDENTIAL: {
    type: "object",
    required: ["issuer", "subject", "credentialSubject", "signature"],
    properties: {
      issuer: { type: "string" },
      subject: { type: "string" },
      credentialSubject: {
        type: "object",
        required: ["object"],
        properties: {
          object: { type: "string" },
          action: {
            type: "object",
            properties: {
              code: { type: "integer" },
              value: { type: "string" }
            }
          }
        }
      },
      signature: { type: "string" },
      metadata: {
        type: "object",
        properties: {
          dateCreated: { type: "string" }
        }
      }
    }
  },
}