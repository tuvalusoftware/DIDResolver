import { getSender } from "./index.js";
import { RABBITMQ_SERVICE } from "./config.js";
import RequestRepo from "../db/repos/requestRepo.js";
import { REQUEST_TYPE } from "./config.js";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
import RabbitService from "../services/Rabbit.service.js";
import { ErrorProducer } from "./rabbit.producer.js";
import { env } from "../configs/constants.js";
import customLogger from "../helpers/customLogger.js";

const pathToLog =
    env.NODE_ENV === "test"
        ? "logs/rabbit/test-task.log"
        : "logs/rabbit/task.log";
const logger = customLogger(pathToLog);

const { sender: cardanoSender, queue: cardanoQueue } = getSender({
    service: RABBITMQ_SERVICE.CardanoService,
});
const { sender: resolverSender, queue: resolverQueue } = getSender({
    service: RABBITMQ_SERVICE.ResolverService,
});

const { sender: errorSender, queue: errorQueue } = getSender({
    service: RABBITMQ_SERVICE.ErrorService,
});

export const CardanoConsumer = async () => {
    cardanoSender.consume(cardanoQueue, async (msg) => {
        if (msg !== null) {
            logger.info("[CardanoQueue] 🔈", msg.content.toString());
            cardanoSender.ack(msg);
        }
    });
};

export const ErrorConsumer = async () => {
    errorSender.consume(errorQueue, async (msg) => {
        if (msg !== null) {
            logger.info("[ErrorQueue] 🔈", msg.content.toString());
            errorSender.ack(msg);
        }
    });
};

export const ResolverConsumer = async () => {
    resolverSender.consume(resolverQueue, async (msg) => {
        if (msg !== null) {
            try {
                const cardanoResponse = JSON.parse(msg.content);
                let response = null;
                if (cardanoResponse?.error_code) {
                    resolverSender.ack(msg);
                    logger.error("[ResolverQueue] 🔈", msg.content.toString());
                    const { data, type, id, retryCount, retryAfter } =
                        cardanoResponse?.data;
                    await ErrorProducer({
                        data,
                        type,
                        id,
                        retryCount,
                        retryAfter,
                    });
                    return;
                }
                const requestData = await RequestRepo.findOne({
                    _id: cardanoResponse?.id,
                });
                switch (requestData?.type) {
                    case REQUEST_TYPE.MINTING_TYPE.createContract: {
                        logger.info("Requesting create contract...");
                        const { companyName, fileName, did } = deepUnsalt(
                            requestData?.data?.wrappedDocument?.data
                        );
                        const { wrappedDocument, metadata } = requestData?.data;
                        const mintingConfig = cardanoResponse.data;
                        await RabbitService().createContract({
                            companyName,
                            fileName,
                            did,
                            wrappedDocument,
                            metadata,
                            mintingConfig,
                        });
                        response = cardanoResponse?.data;
                        break;
                    }
                    case REQUEST_TYPE.MINTING_TYPE.createPlot: {
                        logger.info("Requesting create plot certificate...");
                        const { wrappedDocument, claimants, plot } = deepUnsalt(
                            requestData?.data
                        );
                        const { companyName, fileName, did } =
                            wrappedDocument?.data;
                        const mintingConfig = cardanoResponse.data;
                        await RabbitService().createPlot({
                            wrappedDocument,
                            mintingConfig,
                            claimants,
                            companyName,
                            fileName,
                            did,
                            plot,
                        });
                        response = cardanoResponse?.data;
                        break;
                    }
                    case REQUEST_TYPE.MINTING_TYPE.createClaimantCredential: {
                        try {
                            logger.info(
                                "Requesting create claimant credential..."
                            );
                            const config = cardanoResponse.data;
                            logger.warning(JSON.stringify(config, null, 2))
                            const {
                                credential,
                                verifiedCredential,
                                companyName,
                            } = requestData?.data;
                            const _verifiedCredential =
                                await RabbitService().createClaimantCredential({
                                    credentialHash: credential,
                                    companyName,
                                    verifiedCredential,
                                    txHash: config?.txHash,
                                });
                            logger.warning(JSON.stringify(_verifiedCredential, null, 2))
                            response = {
                                ...cardanoResponse?.data,
                                verifiedCredential: _verifiedCredential,
                            };
                            logger.warning(JSON.stringify(response, null, 2))
                        } catch (error) {
                            logger.error(error);
                        }
                        break;
                    }
                    case REQUEST_TYPE.MINTING_TYPE.signContract: {
                        try {
                            logger.info(
                                "Requesting create claimant credential..."
                            );
                            const {
                                credential,
                                verifiedCredential,
                                companyName,
                            } = requestData?.data;
                            const _verifiedCredential =
                                await RabbitService().createClaimantCredential({
                                    credentialHash: credential,
                                    companyName,
                                    verifiedCredential,
                                });
                            response = {
                                ...cardanoResponse?.data,
                                verifiedCredential: _verifiedCredential,
                            };
                        } catch (error) {
                            logger.error(error);
                        }
                        break;
                    }
                    case REQUEST_TYPE.MINTING_TYPE.updatePlot: {
                        logger.info("Requesting update document...");
                        const { wrappedDocument, claimants, plot } = deepUnsalt(
                            requestData?.data
                        );
                        const { fileName, companyName, did } =
                            wrappedDocument?.data;
                        const updateConfig = cardanoResponse.data;
                        await RabbitService().updatePlot({
                            wrappedDocument,
                            updateConfig,
                            claimants: claimants?.claimants,
                            companyName,
                            fileName,
                            plot,
                            did,
                        });
                        response = cardanoResponse?.data;
                        break;
                    }
                    case REQUEST_TYPE.MINTING_TYPE.deletePlot: {
                        logger.info("Requesting delete document...");
                        response = cardanoResponse?.data;
                        break;
                    }
                    case REQUEST_TYPE.MINTING_TYPE.addClaimantToPlot: {
                        try {
                            logger.info("add claimant to plot certificate...");
                            const {
                                credential,
                                verifiedCredential,
                                companyName,
                            } = requestData?.data;
                            const _verifiedCredential =
                                await RabbitService().createClaimantCredential({
                                    credentialHash: credential,
                                    companyName,
                                    verifiedCredential,
                                });
                            response = {
                                ...cardanoResponse?.data,
                                verifiedCredential: _verifiedCredential,
                            };
                        } catch (error) {
                            logger.error(error);
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
                await RequestRepo.findOneAndUpdate(
                    {
                        response,
                        status: "completed",
                        completedAt: new Date(),
                    },
                    {
                        _id: cardanoResponse?.id,
                    }
                );
                logger.info("[ResolverQueue] 🔈: " + msg.content.toString());
                resolverSender.ack(msg);
            } catch (error) {
                logger.error(error);
            }
        }
    });
};
