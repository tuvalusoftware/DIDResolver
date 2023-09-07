export default {
  COMMONLANDS_CONTRACT: {
    type: "object",
    required: ["description"],
    properties: {
      description: {
        type: "string",
        description: "Description of the contract",
      },
    },
  },
};
