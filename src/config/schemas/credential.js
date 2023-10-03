export default {
  VERIFIABLE_CREDENTIAL: {
    type: "object",
    required: [
      "@context",
      "type",
      "issuer",
      "credentialSubject",
      "signature",
      "proof",
    ],
    properties: {
      "@context": {
        type: "array",
        items: {
          type: "string",
          enum: [
            "https://www.w3.org/ns/credentials/v2",
            "https://www.w3.org/ns/credentials/examples/v2",
          ],
        },
      },
      type: {
        type: "array",
        items: {
          type: "string",
          enum: ["VerifiableCredential"],
        },
      },
      issuer: {
        type: "string",
      },
      validFrom: {
        type: "string",
      },
      proof: {
        type: "object",
        required: ["created", "signature"],
        properties: {
          created: {
            type: "string",
          },
          signature: {
            type: "object",
            required: ["key", "value"],
            properties: {
              key: {
                type: "string",
              },
              value: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          addtionalProperties: true,
        },
        additionalProperties: false,
      },
      credentialSubject: {
        type: "array",
        items: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
            addtionalProperties: true,
          },
        },
      },
    },
    additionalProperties: false,
  },
  CREDENTIAL_SUBJECT: {
    type: "array",
    items: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
        },
        addtionalProperties: true,
      },
    },
  },
};
