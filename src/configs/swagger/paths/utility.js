export const unsalt = {
  post: {
    tags: ["Utility"],
    summary: "Unsalt data",
    description: "Unsalt data",
    operationId: "unsaltData",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "string",
                description: "Data to be unsalted",
              },
            },
            required: ["data"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Unsalted data successfully!",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                },
                status_message: {
                  type: "string",
                },
                data: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};
