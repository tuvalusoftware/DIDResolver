module.exports.setCookie = {
  post: {
    tags: ["Access token"],
    summary: "Set access_token",
    parameters: [
      {
        in: "header",
        name: "access_token",
        type: "string",
        require: true,
      },
    ],
    response: {
      200: {
        description: "",
        content: {
          "text/plain": {
            schema: {
              type: "string",
              example: "Set cookie sucessfully.",
            },
          },
        },
      },
    },
  },
};
