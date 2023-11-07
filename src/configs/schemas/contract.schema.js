import Joi from "joi";

export default {
    // CREATE_CONTRACT_REQUEST_BODY: {
    //     type: "object",
    //     required: ["_id"],
    //     properties: {
    //         _id: {
    //             type: "string",
    //         },
    //     },
    //     additionalProperties: true,
    // },
    CREATE_CONTRACT_REQUEST_BODY: Joi.object()
        .keys({
            _id: Joi.string().required(),
        })
        .unknown(true),
    SIGN_CONTRACT_REQUEST_BODY: {
        type: "object",
        required: ["contract", "claimant", "role"],
        properties: {
            contract: {
                type: "string",
            },
            role: {
                type: "string",
            },
            claimant: {
                type: "object",
                required: ["seedPhrase", "userDid"],
                properties: {
                    certificateDid: {
                        type: "string",
                    },
                    seedPhrase: {
                        type: "string",
                    },
                    userDid: {
                        type: "string",
                    },
                },
                additionalProperties: true,
            },
        },
        additionalProperties: true,
    },
};
