import ControllerService from "../services/Controller.service.js";
import CardanoService from "../services/Cardano.service.js";
import credentialService from "../services/VerifiableCredential.service.js";
import RequestRepo from "../db/repos/requestRepo.js";
import { generateDid } from "../fuixlabs-documentor/utils/did.js";
import { REQUEST_TYPE } from "../rabbit/config.js";
import customLogger from "../helpers/customLogger.js";
import { env } from "../configs/constants.js";

const pathToLog =
    env.NODE_ENV === "test"
        ? "logs/rabbit/test-task.log"
        : "logs/rabbit/task.log";
const logger = customLogger(pathToLog);

const RabbitService = () => {
    return {
        async createContract({
            companyName,
            fileName,
            did,
            wrappedDocument,
            mintingConfig,
            metadata = null,
        }) {
            try {
                const willWrappedDocument = {
                    ...wrappedDocument,
                    mintingConfig,
                };
                await ControllerService().storeDocument({
                    companyName,
                    fileName,
                    wrappedDocument: willWrappedDocument,
                });
                if (metadata) {
                    const didDocumentResponse =
                        await ControllerService().getDocumentDid({
                            did,
                        });
                    const originDidDocument = didDocumentResponse?.data?.didDoc;
                    await ControllerService().updateDocumentDid({
                        did,
                        didDoc: {
                            ...originDidDocument,
                            meta_data: metadata,
                        },
                    });
                }
            } catch(error) {
                throw error;
            }
        },

        async createPlot({
            wrappedDocument,
            mintingConfig,
            claimants,
            companyName,
            fileName,
            did,
            plot,
        }) {
            try {
                const willWrappedDocument = {
                    ...wrappedDocument,
                    mintingConfig,
                };
                await ControllerService().storeDocument({
                    companyName,
                    fileName,
                    wrappedDocument: willWrappedDocument,
                });
                if (claimants?.claimants) {
                    const promises = claimants?.claimants?.map(
                        async (claimant) => {
                            const { verifiableCredential, credentialHash } =
                                await credentialService.createClaimantVerifiableCredential(
                                    {
                                        subject: {
                                            claims: {
                                                plot: plot?._id,
                                                ...claimant,
                                            },
                                        },
                                        issuerKey: did,
                                    }
                                );
                            const request = await RequestRepo.createRequest({
                                data: {
                                    mintingConfig,
                                    credential: credentialHash,
                                    verifiedCredential: verifiableCredential,
                                    companyName,
                                },
                                type: REQUEST_TYPE.MINTING_TYPE
                                    .createClaimantCredential,
                                status: "pending",
                            });
                            await CardanoService().storeCredentialsWithPolicyId(
                                {
                                    credentials: [credentialHash],
                                    mintingConfig,
                                    id: request?._id,
                                }
                            );
                        }
                    );
                    await Promise.all(promises).catch((error) => {
                        logger.error(error);
                    });
                }
            } catch (error) {
                throw error;
            }
        },

        async createClaimantCredential({
            verifiedCredential,
            credentialHash,
            companyName,
            txHash,
        }) {
            try {
                console.log('BUG1', generateDid(companyName, credentialHash))
                const _verifiedCredential = {
                    ...verifiedCredential,
                };
                _verifiedCredential.credentialSubject = {
                    claims: { ..._verifiedCredential.credentialSubject.claims },
                    id: generateDid(companyName, credentialHash),
                };
                console.log('credentialHash', generateDid(companyName, credentialHash))
                await ControllerService().storeCredentials({
                    payload: {
                        ..._verifiedCredential,
                        id: generateDid(companyName, credentialHash),
                        txHash,
                    },
                });
                console.log('here')
                return _verifiedCredential;
            } catch (error) {
                throw error;
            }
        },

        async updatePlot({
            wrappedDocument,
            updateConfig,
            companyName,
            fileName,
            claimants,
            plot,
            did,
        }) {
            try {
                let updateWrappedDocument = {
                    ...wrappedDocument,
                    mintingConfig: updateConfig,
                };
                await ControllerService().storeDocument({
                    companyName,
                    fileName,
                    wrappedDocument: updateWrappedDocument,
                });
                if (claimants) {
                    const promises = claimants.map(async (claimant) => {
                        const { verifiableCredential, credentialHash } =
                            await credentialService.createClaimantVerifiableCredential(
                                {
                                    subject: {
                                        claims: {
                                            plot: plot?._id,
                                            ...claimant,
                                        },
                                    },
                                    issuerKey: did,
                                }
                            );
                        const request = await RequestRepo.createRequest({
                            data: {
                                mintingConfig: updateConfig,
                                credential: credentialHash,
                                verifiedCredential: verifiableCredential,
                                companyName,
                            },
                            type: REQUEST_TYPE.MINTING_TYPE
                                .createClaimantCredential,
                            status: "pending",
                        });
                        await CardanoService().storeCredentialsWithPolicyId({
                            credentials: [credentialHash],
                            mintingConfig: updateConfig,
                            id: request?._id,
                        });
                    });
                    await Promise.all(promises).catch((error) => {
                        logger.error(error);
                    });
                }
            } catch (error) {
                throw error;
            }
        },

        async _createContract({
            companyName,
            fileName,
            did,
            wrappedDocument,
            mintingConfig,
            metadata = null,
        }) {
            try {
                const willWrappedDocument = {
                    ...wrappedDocument,
                    mintingConfig,
                };
                await ControllerService().storeDocument({
                    companyName,
                    fileName,
                    wrappedDocument: willWrappedDocument,
                });
                if (metadata) {
                    const didDocumentResponse =
                        await ControllerService().getDocumentDid({
                            did,
                        });
                    const originDidDocument = didDocumentResponse?.data?.didDoc;
                    await ControllerService().updateDocumentDid({
                        did,
                        didDoc: {
                            ...originDidDocument,
                            meta_data: metadata,
                        },
                    });
                }
            } catch(error) {
                throw error;
            }
        },

        async _updatePlot({
            wrappedDocument,
            updateConfig,
            companyName,
            fileName,
        }) {
            try {
                let updateWrappedDocument = {
                    ...wrappedDocument,
                    mintingConfig: updateConfig,
                };
                await ControllerService().storeDocument({
                    companyName,
                    fileName,
                    wrappedDocument: updateWrappedDocument,
                });
            } catch (error) {
                throw error;
            }
        },
    };
};

export default RabbitService;
