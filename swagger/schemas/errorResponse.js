module.exports = {
  type: "object",
  required: ["errorCode", "errorMessage"],
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
  }
}