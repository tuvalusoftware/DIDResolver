import { getSender } from "./index.js";
import { RABBITMQ_SERVICE } from "./config.js";
import RequestRepo from "../db/repos/requestRepo.js";
import { REQUEST_TYPE } from "./config.js";
import { ControllerHelper, AuthHelper } from "../helpers/index.js";
import "dotenv/config";
import { Logger } from "tslog";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
const logger = new Logger();

const { sender: cardanoSender, queue: cardanoQueue } = getSender({
    service: RABBITMQ_SERVICE?.CardanoService,
});
const { sender: resolverSender, queue: resolverQueue } = getSender({
    service: RABBITMQ_SERVICE?.ResolverService,
});

export const CardanoConsumer = async () => {
    cardanoSender.consume(cardanoQueue, async (msg) => {
        if (msg !== null) {
            logger.info("[CardanoQueue] 🔈", msg.content.toString());
            cardanoSender.ack(msg);
        }
    });
};

export const ResolverConsumer = async () => {
    resolverSender.consume(resolverQueue, async (msg) => {
        if (msg !== null) {
            const cardanoResponse = JSON.parse(msg.content);
            if (cardanoResponse?.error_code) {
                logger.error("[ResolverQueue] 🔈", msg.content.toString());
                resolverSender.ack(msg);
                return;
            }
            const requestData = await RequestRepo.retrieveRequest({
                _id: cardanoResponse?.id,
            });
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            switch (requestData?.type) {
                case REQUEST_TYPE.MINTING_TYPE.createContract: {
                    const { companyName, fileName, did } = deepUnsalt(
                        requestData?.data?.wrappedDocument?.data
                    );
                    const { wrappedDocument, metadata } = requestData?.data;
                    const mintingConfig = cardanoResponse.data;
                    const willWrappedDocument = {
                        ...wrappedDocument,
                        mintingConfig,
                    };
                    await ControllerHelper.storeDocument({
                        accessToken,
                        companyName,
                        fileName,
                        wrappedDocument: willWrappedDocument,
                    });
                    if (metadata) {
                        const didDocumentResponse =
                            await ControllerHelper.getDocumentDid({
                                did,
                                accessToken,
                            });
                        const originDidDocument =
                            didDocumentResponse?.data?.didDoc;
                        await ControllerHelper.updateDocumentDid({
                            accessToken,
                            did,
                            didDoc: {
                                ...originDidDocument,
                                meta_data: metadata,
                            },
                        });
                    }
                    break;
                }
                default: {
                    break;
                }
            }
            await RequestRepo.updateRequest(
                {
                    response: cardanoResponse?.data,
                    status: "completed",
                    completedAt: new Date(),
                },
                {
                    _id: cardanoResponse?.id,
                }
            );
            logger.info("[ResolverQueue] 🔈", msg.content.toString());
            resolverSender.ack(msg);
        }
    });
};
