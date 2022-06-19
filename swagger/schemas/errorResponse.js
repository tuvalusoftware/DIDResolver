module.exports = {
  type: "object",
  properties: {
    errorCode: {
      type: "integer",
    },
    errorMessage: {
      type: "string",
    },
    detail: {
      type: "string",
    }
  },
  required: ["errorCode", "errorMessage"]
}