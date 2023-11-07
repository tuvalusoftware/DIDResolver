import Joi from "joi";

export default {
    dataForIssueDocument: Joi.object()
        .keys({
            fileName: Joi.string().required(),
            name: Joi.string().required(),
            title: Joi.string().required(),
        })
        .unknown(true),
};
