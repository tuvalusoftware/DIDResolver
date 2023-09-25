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
};
