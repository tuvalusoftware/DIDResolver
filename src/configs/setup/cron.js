import cron from "node-cron";
import { RequestModel } from "../../db/models/requestModel.js";
import { REQUEST_TYPE } from "../../rabbit/config.js";
import CardanoService from "../../services/Cardano.service.js";
import ControllerService from "../../services/Controller.service.js";
import { env } from "../constants.js";
import { AppError } from "../errors/appError.js";
import { ERRORS } from "../errors/error.constants.js";
import RequestRepo from "../../db/repos/requestRepo.js";
import customLogger from "../../helpers/customLogger.js";

const pathToLog =
    env.NODE_ENV === "test"
        ? "logs/rabbit/test-task.log"
        : "logs/rabbit/task.log";
const logger = customLogger(pathToLog);

export const setUpCron = () => {
    const task = cron.schedule(
        env.CRON_REMINDER,
        async () => {
            const request = await RequestModel.findOne({
                status: "pending",
                type: {
                    $in: [
                        REQUEST_TYPE.MINTING_TYPE.updatePlot,
                        REQUEST_TYPE.MINTING_TYPE.addClaimantToPlot,
                        REQUEST_TYPE.MINTING_TYPE.signContract,
                    ],
                },
            }).sort({ updatedAt: -1 });
            if (request) {
                try {
                    switch (request.type) {
                        case REQUEST_TYPE.MINTING_TYPE.updatePlot: {
                            logger.info(`Cron update plot ${request._id}`);
                            const { wrappedDocument, originDid } = request.data;
                            const documentContentResponse =
                                await ControllerService().getDocumentContent({
                                    did: originDid,
                                });
                            if (
                                !documentContentResponse?.data?.wrappedDoc
                                    ?.mintingConfig
                            ) {
                                logger.error(
                                    `There are no mintingConfig in request ${request._id}`
                                );
                                throw new AppError(ERRORS.INVALID_INPUT);
                            }
                            const { mintingConfig } =
                                documentContentResponse.data.wrappedDoc;
                            Object.assign(mintingConfig, { reuse: true });
                            await CardanoService().updateToken({
                                hash: wrappedDocument?.signature?.targetHash,
                                mintingConfig,
                                id: request._id,
                            });
                            logger.info(
                                `Cron update plot ${request._id} finished`
                            );
                            break;
                        }
                        case REQUEST_TYPE.MINTING_TYPE.addClaimantToPlot: {
                            logger.info(`Cron add claimant ${request._id}`);
                            const { originDid, credential } = request.data;
                            const documentContentResponse =
                                await ControllerService().getDocumentContent({
                                    did: originDid,
                                });
                            if (
                                !documentContentResponse.data?.wrappedDoc
                                    ?.mintingConfig
                            ) {
                                logger.error(
                                    `There are no mintingConfig in request ${request._id}`
                                );
                                throw new AppError(ERRORS.INVALID_INPUT);
                            }
                            const { mintingConfig } =
                                documentContentResponse.data.wrappedDoc;
                            await CardanoService().storeCredentialsWithPolicyId(
                                {
                                    credentials: [credential],
                                    mintingConfig,
                                    id: request._id,
                                }
                            );
                            logger.info(
                                `Cron add claimant ${request._id} finished`
                            );
                            break;
                        }
                        case REQUEST_TYPE.MINTING_TYPE.signContract: {
                            logger.info(`Cron sign contract ${request._id}`);
                            const { originDid, credential } = request.data;
                            const documentContentResponse =
                                await ControllerService().getDocumentContent({
                                    did: originDid,
                                });
                            if (
                                !documentContentResponse.data?.wrappedDoc
                                    ?.mintingConfig
                            ) {
                                logger.error(
                                    `There are no mintingConfig in request ${request._id}`
                                );
                                throw new AppError(ERRORS.INVALID_INPUT);
                            }
                            const { mintingConfig } =
                                documentContentResponse.data.wrappedDoc;
                            await CardanoService().storeCredentialsWithPolicyId(
                                {
                                    credentials: [credential],
                                    mintingConfig,
                                    id: request._id,
                                }
                            );
                            logger.info(
                                `Cron sign contract ${request._id} finished`
                            );
                            break;
                        }
                        default:
                            throw new AppError(ERRORS.INVALID_INPUT);
                    }
                    await RequestRepo.findOneAndUpdate(
                        { status: "minting" },
                        { _id: request._id }
                    );
                } catch (error) {
                    logger.error(error);
                    await RequestRepo.findOneAndUpdate(
                        { error: error.message },
                        { _id: request._id }
                    );
                }
            }
        },
        {
            scheduled: false,
        }
    );

    task.start();
};
