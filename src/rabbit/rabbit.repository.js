import ControllerService from "../services/Controller.service.js";
import CardanoService from "../services/Cardano.service.js";
import { createClaimantVerifiableCredential } from "../utils/credential.js";
import RequestRepo from "../db/repos/requestRepo.js";
import { generateDid } from "../fuixlabs-documentor/utils/did.js";
import { REQUEST_TYPE } from "./config.js";
import { Logger } from "tslog";

const logger = new Logger();

/**
 * Rabbit repository module.
 * @param {string} accessToken - The access token.
 * @returns {Object} Rabbit repository object.
 */
const RabbitRepository = (accessToken) => {
    return {
        /**
         * Creates a contract.
         * @async
         * @param {Object} params - The contract parameters.
         * @param {string} params.companyName - The company name.
         * @param {string} params.fileName - The file name.
         * @param {string} params.did - The DID.
         * @param {Object} params.wrappedDocument - The wrapped document.
         * @param {Object} params.mintingConfig - The minting configuration.
         * @param {Object} [params.metadata=null] - The metadata.
         */
        async createContract({
            companyName,
            fileName,
            did,
            wrappedDocument,
            mintingConfig,
            metadata = null,
        }) {
            const willWrappedDocument = {
                ...wrappedDocument,
                mintingConfig,
            };
            await ControllerService(accessToken).storeDocument({
                companyName,
                fileName,
                wrappedDocument: willWrappedDocument,
            });
            if (metadata) {
                const didDocumentResponse = await ControllerService(
                    accessToken
                ).getDocumentDid({
                    did,
                });
                const originDidDocument = didDocumentResponse?.data?.didDoc;
                await ControllerService(accessToken).updateDocumentDid({
                    accessToken,
                    did,
                    didDoc: {
                        ...originDidDocument,
                        meta_data: metadata,
                    },
                });
            }
        },

        /**
         * Creates a plot.
         * @async
         * @param {Object} params - The plot parameters.
         * @param {Object} params.wrappedDocument - The wrapped document.
         * @param {Object} params.mintingConfig - The minting configuration.
         * @param {Object} params.claimants - The claimants.
         * @param {string} params.companyName - The company name.
         * @param {string} params.fileName - The file name.
         * @param {string} params.did - The DID.
         * @param {Object} params.plot - The plot.
         */
        async createPlot({
            wrappedDocument,
            mintingConfig,
            claimants,
            companyName,
            fileName,
            did,
            plot,
        }) {
            const willWrappedDocument = {
                ...wrappedDocument,
                mintingConfig,
            };
            await ControllerService(accessToken).storeDocument({
                companyName,
                fileName,
                wrappedDocument: willWrappedDocument,
            });
            if (claimants?.claimants) {
                const promises = claimants?.claimants?.map(async (claimant) => {
                    const { verifiableCredential, credentialHash } =
                        await createClaimantVerifiableCredential({
                            subject: {
                                claims: {
                                    plot: plot?._id,
                                    ...claimant,
                                },
                            },
                            issuerKey: did,
                        });
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
                    await CardanoService(
                        accessToken
                    ).storeCredentialsWithPolicyId({
                        credentials: [credentialHash],
                        mintingConfig,
                        id: request?._id,
                    });
                });
                await Promise.all(promises).catch((error) => {
                    logger.error(error);
                });
            }
        },

        /**
         * Creates a claimant credential.
         * @async
         * @param {Object} params - The claimant credential parameters.
         * @param {Object} params.verifiedCredential - The verified credential.
         * @param {string} params.credentialHash - The credential hash.
         * @param {string} params.companyName - The company name.
         * @returns {Object} The verified credential.
         */
        async createClaimantCredential({
            verifiedCredential,
            credentialHash,
            companyName,
        }) {
            try {
                const _verifiedCredential = {
                    ...verifiedCredential,
                };
                _verifiedCredential.credentialSubject = {
                    claims: { ..._verifiedCredential.credentialSubject.claims },
                    id: generateDid(companyName, credentialHash),
                };
                ControllerService(accessToken).storeCredentials({
                    payload: {
                        ..._verifiedCredential,
                        id: generateDid(companyName, credentialHash),
                    },
                });
                return _verifiedCredential;
            } catch (error) {
                throw error;
            }
        },

        /**
         * Updates a plot.
         * @async
         * @param {Object} params - The plot parameters.
         * @param {Object} params.wrappedDocument - The wrapped document.
         * @param {Object} params.updateConfig - The update configuration.
         * @param {string} params.companyName - The company name.
         * @param {string} params.fileName - The file name.
         * @param {Object} params.claimants - The claimants.
         * @param {Object} params.plot - The plot.
         * @param {string} params.did - The DID.
         */
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
                await ControllerService(accessToken).storeDocument({
                    companyName,
                    fileName,
                    wrappedDocument: updateWrappedDocument,
                });
                if (claimants) {
                    const promises = claimants.map(async (claimant) => {
                        const { verifiableCredential, credentialHash } =
                            await createClaimantVerifiableCredential({
                                subject: {
                                    claims: {
                                        plot: plot?._id,
                                        ...claimant,
                                    },
                                },
                                issuerKey: did,
                            });
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
                        await CardanoService(
                            accessToken
                        ).storeCredentialsWithPolicyId({
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
    };
};

export default RabbitRepository;
