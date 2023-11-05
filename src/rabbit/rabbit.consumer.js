import { getSender } from "./index.js";
import { RABBITMQ_SERVICE } from "./config.js";
import RequestRepo from "../db/repos/requestRepo.js";
import { REQUEST_TYPE } from "./config.js";
import "dotenv/config";
import { Logger } from "tslog";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
import AuthenticationService from "../services/Authentication.service.js";
import RabbitRepository from "./rabbit.repository.js";
import { ErrorProducer } from "./rabbit.producer.js";

const logger = new Logger();

const { sender: cardanoSender, queue: cardanoQueue } = getSender({
    service: RABBITMQ_SERVICE.CardanoService,
});
const { sender: resolverSender, queue: resolverQueue } = getSender({
    service: RABBITMQ_SERVICE.ResolverService,
});

const { sender: errorSender, queue: errorQueue } = getSender({
    service: RABBITMQ_SERVICE.ErrorService,
})

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
    })
}

export const ResolverConsumer = async () => {
    resolverSender.consume(resolverQueue, async (msg) => {
        if (msg !== null) {
            try {
                const cardanoResponse = JSON.parse(msg.content);
                let response = null;
                if (cardanoResponse?.error_code) {
                    logger.error("[ResolverQueue] 🔈", msg.content.toString());
                    const { data, type, id } = cardanoResponse;
                    await ErrorProducer({
                        data,
                        type,
                        id,
                    });
                    resolverSender.ack(msg);
                    return;
                }
                const requestData = await RequestRepo.retrieveRequest({
                    _id: cardanoResponse?.id,
                });
                const accessToken =
                    process.env.NODE_ENV === "test"
                        ? "mock-access-token"
                        : await AuthenticationService().authenticationProgress();
                switch (requestData?.type) {
                    case REQUEST_TYPE.MINTING_TYPE.createContract: {
                        logger.info("Requesting create contract...");
                        const { companyName, fileName, did } = deepUnsalt(
                            requestData?.data?.wrappedDocument?.data
                        );
                        const { wrappedDocument, metadata } = requestData?.data;
                        const mintingConfig = cardanoResponse.data;
                        await RabbitRepository(accessToken).createContract({
                            companyName,
                            fileName,
                            did,
                            wrappedDocument,
                            metadata,
                            mintingConfig
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
                        await RabbitRepository(accessToken).createPlot({
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
                            const {
                                credential,
                                verifiedCredential,
                                companyName,
                            } = requestData?.data;
                            const _verifiedCredential = await RabbitRepository(
                                accessToken
                            ).createClaimantCredential({
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
                        await RabbitRepository(accessToken).updatePlot({
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
                    default: {
                        break;
                    }
                }
                await RequestRepo.updateRequest(
                    {
                        response,
                        status: "completed",
                        completedAt: new Date(),
                    },
                    {
                        _id: cardanoResponse?.id,
                    }
                );
                logger.info("[ResolverQueue] 🔈", msg.content.toString());
                resolverSender.ack(msg);
            } catch (error) {
                logger.error(error);
            }
        }
    });
};
