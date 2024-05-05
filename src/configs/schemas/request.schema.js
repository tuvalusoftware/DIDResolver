import Joi from "joi";

export default {
    createDocument: Joi.object()
        .keys({
            wrappedDoc: Joi.object()
                .required()
                .keys({
                    _id: Joi.string().required(),
                })
                .unknown(true),
            fileName: Joi.string().required(),
            type: Joi.string().required(),
            companyName: Joi.string().required(),
            network: Joi.string().required().valid("cardano", "stellar"),
        })
        .unknown(true),
    getDocumentContentByDid: Joi.object()
        .required()
        .keys({
            did: Joi.string()
                .required()
                .string()
                .pattern(/did:([a-z0-9]+):([a-zA-Z0-9]+):([a-zA-Z0-9]+)/),
        }),
};
