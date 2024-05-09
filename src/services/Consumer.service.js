import { rabbitMQ } from "../rabbit/index.js";
import { REQUEST_TYPE, RABBITMQ_SERVICE } from "../rabbit/config.js";
import { AppError } from "../configs/errors/appError.js";
import { ERRORS } from "../configs/errors/error.constants.js";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
import { env } from "../configs/constants.js";
import customLogger from "../helpers/customLogger.js";
import { randomUUID } from "crypto";
import DocumentRepository from "../db/repos/documentRepo.js";

const pathToLog =
    env.NODE_ENV === "test"
        ? "logs/rabbit/test-task.log"
        : "logs/rabbit/task.log";

const logger = customLogger(pathToLog);

class ConsumerService {
    /**
     * Creates a channel with a random correlation ID queue.
     * @returns {Promise<{ channel: any, correlationId: string, replyQueue: any }>} The created channel, correlation ID, and reply queue.
     */
    async createChannelWithRandomCorrelationIdQueue() {
        const channel = await rabbitMQ.createChannel();
        const correlationId = randomUUID();
        const replyQueue = await channel.assertQueue(correlationId);
        return { channel, correlationId, replyQueue };
    }
    /**
     * Sends data to a queue using the provided channel.
     *
     * @param {Channel} channel - The channel to send the data.
     * @param {string} queue - The name of the queue to send the data to.
     * @param {Object} data - The data to send to the queue.
     * @param {Object} options - The options for sending the data.
     */
    sendDataToQueue(channel, queue, data, options) {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), options);
    }

    // ** SPECIALIZED FUNCTIONS **
    async createDocument(hash, id, type, request, network = "stellar") {
        try {
            const { channel, correlationId, replyQueue } =
                await this.createChannelWithRandomCorrelationIdQueue();

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

            const queueName = network === "cardano" ? RABBITMQ_SERVICE.cardano.CardanoDocumentService : RABBITMQ_SERVICE.stellar.StellarService;

            this.sendDataToQueue(
                channel,
                queueName,
                requestMessage,
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
                            const { companyName, fileName } = deepUnsalt(
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
                            const { wrappedDocument } = request.data;
                            const mintingConfig = cardanoResponse.data;
                            const document = {
                                ...wrappedDocument,
                                mintingConfig,
                            };
                            await DocumentRepository.storeDocument(document, {
                                companyName,
                                fileName,
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
    }
}

const consumerService = new ConsumerService();
export default consumerService;
