import cron from "node-cron";
import { RequestModel } from "../../db/models/requestModel.js";
import { REQUEST_TYPE } from "../../rabbit/config.js";
import CardanoService from "../../services/Cardano.service.js";
import ControllerService from "../../services/Controller.service.js";
import AuthenticationService from "../../services/Authentication.service.js";
import { env } from "../constants.js";
import { AppError } from "../errors/appError.js";
import { ERRORS } from "../errors/error.constants.js";
import RequestRepo from "../../db/repos/requestRepo.js";
import logger from "../../../logger.js";

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
                            logger.info("update plot");
                            const { wrappedDocument, originDid } = request.data;
                            const accessToken =
                                env.NODE_ENV === "test"
                                    ? "mock-access-token"
                                    : await AuthenticationService().authenticationProgress();
                            const documentContentResponse =
                                await ControllerService(
                                    accessToken
                                ).getDocumentContent({
                                    did: originDid,
                                });
                            const { mintingConfig } =
                                documentContentResponse?.data?.wrappedDoc;
                            Object.assign(mintingConfig, { reuse: true });
                            await CardanoService(accessToken).updateToken({
                                hash: wrappedDocument?.signature?.targetHash,
                                mintingConfig,
                                id: request._id,
                            });
                            break;
                        }
                        case REQUEST_TYPE.MINTING_TYPE.addClaimantToPlot: {
                            logger.info("add claimant to plot");
                            const { originDid, credential } = request.data;
                            const accessToken =
                                env.NODE_ENV === "test"
                                    ? "mock-access-token"
                                    : await AuthenticationService().authenticationProgress();
                            const documentContentResponse =
                                await ControllerService(
                                    accessToken
                                ).getDocumentContent({
                                    did: originDid,
                                });
                            const { mintingConfig } =
                                documentContentResponse.data?.wrappedDoc;
                            await CardanoService(
                                accessToken
                            ).storeCredentialsWithPolicyId({
                                credentials: [credential],
                                mintingConfig,
                                id: request._id,
                            });
                            break;
                        }
                        case REQUEST_TYPE.MINTING_TYPE.signContract: {
                            logger.info("sign contract");
                            const { originDid, credential } = request.data;
                            const accessToken =
                                env.NODE_ENV === "test"
                                    ? "mock-access-token"
                                    : await AuthenticationService().authenticationProgress();
                            const documentContentResponse =
                                await ControllerService(
                                    accessToken
                                ).getDocumentContent({
                                    did: originDid,
                                });
                            const { mintingConfig } =
                                documentContentResponse.data?.wrappedDoc;
                            await CardanoService(
                                accessToken
                            ).storeCredentialsWithPolicyId({
                                credentials: [credential],
                                mintingConfig,
                                id: request._id,
                            });
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
