export const user = {
    get: {
        tags: ["Commonlands User"],
        summary: "Get user did",
        description: "Get user did",
        operationId: "getUserDid",
        parameters: [
            {
                name: "key",
                in: "query",
                description: "key",
                required: true,
                schema: {
                    type: "string",
                    example: "Dev-fuixlabs",
                },
            },
        ],
        responses: {
            200: {
                description: "Get user did",
                content: {
                    "application/json": {
                        examples: {
                            "Get user did": {
                                summary: "Get user did",
                                value: {
                                    did: "did:fuixlabs:Dev-fuixlabs",
                                },
                            },
                            "Missing parameters": {
                                summary: "Missing parameters",
                                value: {
                                    error_code: 400,
                                    message: "Missing parameters",
                                    detail: [
                                        {
                                            key: "key",
                                            message: "key is required",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
