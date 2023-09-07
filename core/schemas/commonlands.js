export default {
  COMMONLANDS_CONTRACT: {
    type: "object",
    require: ["description"],
    properties: {
      description: {
        type: "string",
        description: "Description of the contract",
      },
    },
  },
};
