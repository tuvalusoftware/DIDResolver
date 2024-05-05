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
            companyName: Joi.string().required(),
            network: Joi.string().required().valid("cardano", "stellar"),
            type: Joi.string().required(),
        })
        .unknown(true),
    getDocumentContentByDid: Joi.object()
        .required()
        .keys({
            did: Joi.string()
                .required()
                .pattern(/did:([a-z0-9]+):([a-zA-Z0-9]+):([a-zA-Z0-9]+)/),
        }),
};
