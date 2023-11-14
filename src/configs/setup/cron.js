import cron from "node-cron";
import { RequestModel } from "../../db/models/requestModel.js";
import { REQUEST_TYPE } from "../../rabbit/config.js";
import CardanoService from "../../services/Cardano.service.js";
import ControllerService from "../../services/Controller.service.js";
import AuthenticationService from "../../services/Authentication.service.js";
import { env } from "../constants.js";
import { AppError } from "../errors/appError.js";
import { ERRORS } from "../errors/error.constants.js";
import logger from "../../../logger.js";

export const setUpCron = (app) => {
    const task = cron.schedule(
        "*/5 * * * *",
        async () => {
            const request = await RequestModel.findOne({
                status: "pending",
                type: {
                    $in: [
                        REQUEST_TYPE.MINTING_TYPE.updatePlot,
                        REQUEST_TYPE.MINTING_TYPE.addClaimantToPlot,
                    ],
                },
            }).sort({ createdAt: -1 });
            if (request) {
                try {
                    switch (request.type) {
                        case REQUEST_TYPE.MINTING_TYPE.updatePlot: {
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
                } catch (error) {
                    logger.error(error);
                }
            }
        },
        {
            scheduled: false,
        }
    );

    task.start();
};
