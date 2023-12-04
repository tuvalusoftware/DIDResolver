import { rabbitMQ } from "../rabbit/index.js";
import { REQUEST_TYPE, RABBITMQ_SERVICE } from "../rabbit/config.js";
import { AppError } from "../configs/errors/appError.js";
import { ERRORS } from "../configs/errors/error.constants.js";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
import RabbitRepository from "../rabbit/rabbit.repository.js";
import { randomUUID } from "crypto";

const ConsumerService = () => {
    return {
        createDocument: async (hash, id, type, request) => {
            try {
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
                        if (msg !== null) {
                            const cardanoResponse = JSON.parse(msg.content);
                            if (cardanoResponse.id === request._id.toString()) {
                                const { companyName, fileName, did } =
                                    deepUnsalt(
                                        request?.data?.wrappedDocument?.data
                                    );
                                const { wrappedDocument, metadata } =
                                    request?.data;
                                const mintingConfig = cardanoResponse.data;
                                await RabbitRepository(
                                    "accessToken"
                                )._createContract({
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
                return config;
            } catch (error) {
                throw error;
            }
        },
        updateDocument: async (hash, id, type, request, config) => {
            try {
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
                                const { wrappedDocument, claimants, plot } =
                                    deepUnsalt(request?.data);
                                const { fileName, companyName, did } =
                                    wrappedDocument?.data;
                                const updateConfig = cardanoResponse.data;
                                await RabbitRepository(
                                    "accessToken"
                                )._updatePlot({
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
                return _config;
            } catch (error) {
                throw error;
            }
        },
    };
};

export default ConsumerService;
