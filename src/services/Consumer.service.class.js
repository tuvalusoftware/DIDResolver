// Path: src/services/Consumer.service.class.js
import { rabbitMQ } from "../rabbit/index.js";
import { REQUEST_TYPE, RABBITMQ_SERVICE } from "../rabbit/config.js";
import { AppError } from "../configs/errors/appError.js";
import { ERRORS } from "../configs/errors/error.constants.js";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
import { env } from "../configs/constants.js";
import customLogger from "../helpers/customLogger.js";
import { randomUUID } from "crypto";

const pathToLog =
    env.NODE_ENV === "test"
        ? "logs/rabbit/test-task.log"
        : "logs/rabbit/task.log";

const logger = customLogger(pathToLog);

class ConsumerService {
    async createDocument(hash, id, type, request) {
        try {
            logger.info(`Create document with hash ${hash} and id ${id}`);
            const channel = await rabbitMQ.createChannel();
            const correlationId = randomUUID();
            const replyQueue = await channel.assertQueue(correlationId);
            const requestMessage = {
                type: REQUEST_TYPE.CARDANO_SERVICE.mintToken,
                data: {
                    hash,
                    type,
                },
                id,
                options: {
                    skipWait: true,
                },
            };
            channel.sendToQueue(
                RABBITMQ_SERVICE.CardanoContractService,
                Buffer.from(JSON.stringify(requestMessage)),
                {
                    correlationId,
                    replyTo: correlationId,
                }
            );
            const createPlotHandle = new Promise((resolve, reject) => {
                channel.consume(replyQueue.queue, async (msg) => {
                    console.log(msg);
                    if (msg !== null) {
                        const cardanoResponse = JSON.parse(msg.content);
                        if (cardanoResponse.id === request._id.toString()) {
                            const { companyName, fileName, did } = deepUnsalt(
                                request?.data?.wrappedDocument?.data
                            );
                            if (!request?.data?.wrappedDocument) {
                                logger.error(
                                    `There are no wrappedDocument in request ${id}`
                                );
                                reject(
                                    new AppError(ERRORS.RABBIT_MESSAGE_ERROR)
                                );
                            }
                            const { wrappedDocument, metadata } = request.data;
                            const mintingConfig = cardanoResponse.data;
                            await RabbitService()._createContract({
                                companyName,
                                fileName,
                                did,
                                wrappedDocument,
                                metadata,
                                mintingConfig,
                            });
                            resolve(mintingConfig);
                        }
                        channel.ack(msg);
                    }
                    reject(new AppError(ERRORS.RABBIT_MESSAGE_ERROR));
                });
            });
            const config = await createPlotHandle;
            await channel.close();
            logger.info(
                `Created document successfully with hash ${hash} and transaction-id ${config?.txHash}\n`
            );
            return config;
        } catch (error) {
            throw error;
        }
    }

    async updateDocument(hash, id, type, request, config) {
        logger.info(`Update document with hash ${hash} and id ${id}`);
        const channel = await rabbitMQ.createChannel();
        const correlationId = randomUUID();
        const replyQueue = await channel.assertQueue(correlationId);
        const mintingConfig = {
            ...config,
            reuse: true,
        };
        const requestMessage = {
            data: {
                newHash: hash,
                config: {
                    ...mintingConfig,
                    burn: false,
                },
                type,
            },
            options: {
                skipWait: true,
            },
            type: REQUEST_TYPE.CARDANO_SERVICE.updateToken,
            id,
        };
        channel.sendToQueue(
            RABBITMQ_SERVICE.CardanoContractService,
            Buffer.from(JSON.stringify(requestMessage)),
            {
                correlationId,
                replyTo: correlationId,
            }
        );
        const createPlotHandle = new Promise((resolve, reject) => {
            channel.consume(replyQueue.queue, async (msg) => {
                if (msg !== null) {
                    const cardanoResponse = JSON.parse(msg.content);
                    if (cardanoResponse.id === request._id.toString()) {
                        const { wrappedDocument } = deepUnsalt(request?.data);
                        if (
                            !wrappedDocument?.data?.fileName ||
                            !wrappedDocument?.data?.companyName
                        ) {
                            logger.error(
                                `There are no wrappedDocument or metadata in request ${id}`
                            );
                            throw reject(
                                new AppError(ERRORS.RABBIT_MESSAGE_ERROR)
                            );
                        }
                        const { fileName, companyName } = wrappedDocument.data;
                        const updateConfig = cardanoResponse.data;
                        await RabbitService()._updatePlot({
                            wrappedDocument,
                            updateConfig,
                            companyName,
                            fileName,
                        });
                        resolve(updateConfig);
                    }
                    channel.ack(msg);
                }
                reject(new AppError(ERRORS.RABBIT_MESSAGE_ERROR));
            });
        });
        const _config = await createPlotHandle;
        await channel.close();
        logger.info(
            `Updated document successfully with hash ${hash} and transaction-id ${_config?.txHash}\n`
        );
        return _config;
    }
    catch(error) {
        throw error;
    }
}

const consumerService = new ConsumerService();
export default consumerService;
