export default {
  COMMONLANDS_CONTRACT: {
    type: "object",
    required: ["url"],
    properties: {
      description: {
        type: "string",
        description: "url of the contract",
      },
    },
    additionalProperties: true,
  },
};
