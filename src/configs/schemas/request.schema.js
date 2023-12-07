import Joi from "joi";

export default {
    createContract: Joi.object()
        .keys({
            wrappedDoc: Joi.object()
                .required()
                .keys({
                    _id: Joi.string().required(),
                })
                .unknown(true),
            metadata: Joi.object().optional().unknown(true),
        })
        .unknown(true),
    signContractWithClaimant: Joi.object()
        .keys({
            contract: Joi.string()
                .required()
                .regex(/^did:[A-Za-z0-9_]+:[A-Za-z0-9.\-:_ ]+$/),
            role: Joi.string().required(),
            claimant: Joi.object()
                .keys({
                    certificateDid: Joi.string().optional(),
                    seedPhrase: Joi.string().required(),
                    userDid: Joi.string().required(),
                })
                .unknown(true),
        })
        .unknown(true),
    createCertificateForPlot: Joi.object()
        .keys({
            plot: Joi.object()
                .keys({
                    name: Joi.string().required(),
                    _id: Joi.string().required(),
                    claimants: Joi.array().required(),
                })
                .unknown(true),
        })
        .unknown(true),
    revokeCertificateForPlot: Joi.object().keys({
        did: Joi.string()
            .required()
            .regex(/^did:[A-Za-z0-9_]+:[A-Za-z0-9.\-:_ ]+$/),
    }),
    addClaimantToPlot: Joi.object()
        .keys({
            plotDid: Joi.string()
                .required()
                .regex(/^did:[A-Za-z0-9_]+:[A-Za-z0-9.\-:_ ]+$/),
            claimant: Joi.object()
                .keys({
                    did: Joi.string()
                        .required()
                        .regex(/^did:[A-Za-z0-9_]+:[A-Za-z0-9.\-:_ ]+$/),
                    role: Joi.string().required(),
                })
                .unknown(true),
        })
        .unknown(true),
    unsaltData: Joi.object()
        .keys({
            data: Joi.object().required().unknown(true),
        })
        .unknown(true),
    verifyCertificate: Joi.object().keys({
        did: Joi.string()
            .required()
            .regex(/^did:[A-Za-z0-9_]+:[A-Za-z0-9.\-:_ ]+$/),
    }),
    updateContract: Joi.object()
        .keys({
            did: Joi.string()
                .required()
                .regex(/^did:[A-Za-z0-9_]+:[A-Za-z0-9.\-:_ ]+$/),
            metadata: Joi.object().optional().unknown(true),
        })
        .unknown(true),
    verifyContract: Joi.object()
        .keys({
            seedPhrase: Joi.string().required(),
            contractDid: Joi.string().required(),
        })
        .unknown(true),
    checkLastestVersion: Joi.object()
        .keys({
            did: Joi.string()
                .required()
                .regex(/^did:[A-Za-z0-9_]+:[A-Za-z0-9.\-:_ ]+$/),
            hash: Joi.string().required(),
        })
        .unknown(true),
    did: Joi.object().keys({
        did: Joi.string()
            .required()
            .regex(/^did:[A-Za-z0-9_]+:[A-Za-z0-9.\-:_ ]+$/),
    }),
    getTransactionId: Joi.object().keys({
        did: Joi.string()
            .required()
            .regex(/^did:[A-Za-z0-9_]+:[A-Za-z0-9.\-:_ ]+$/),
    }),
};
