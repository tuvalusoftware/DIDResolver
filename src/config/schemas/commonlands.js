export default {
  COMMONLANDS_CONTRACT: {
    type: "object",
    required: ["hash"],
    properties: {
      hash: {
        type: "string",
        description: "hash of the contract",
      },
    },
    additionalProperties: true,
  },
  ASSIGN_CREDENTIAL_METADATA: {
    type: "object",
    required: ["certificateDid"],
    properties: {
      certificateDid: {
        type: "string",
        description: "did of the certificate",
      },
    },
    additionalProperties: true,
  },
};
