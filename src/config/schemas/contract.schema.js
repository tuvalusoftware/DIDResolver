export default {
    CREATE_CONTRACT_REQUEST_BODY: {
        type: "object",
        required: ["_id"],
        properties: {
            _id: {
                type: "string",
            },
        },
        additionalProperties: true,
    },
};
