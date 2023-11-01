import { SERVERS } from "../configs/constants.js";
import { handleServiceError } from "../configs/errors/errorHandler.js";
import { CardanoProducer } from "../rabbit/rabbit.producer.js";
import { REQUEST_TYPE } from "../rabbit/config.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

/**
 * CardanoService is a service that provides methods for interacting with the Cardano blockchain.
 * @param {string} accessToken - The access token to use for authentication.
 * @returns {Object} An object containing methods for interacting with the Cardano blockchain.
 */
const CardanoService = (accessToken) => {
    const serverUrl = SERVERS.CARDANO_SERVICE;
    const corsConfig = {
        withCredentials: true,
        headers: {
            Cookie: `access_token=${accessToken}`,
        },
    };

    return {
        /**
         * Stores the given credentials on the Cardano blockchain.
         * @param {Object} options - The options for storing the credentials.
         * @param {string} options.credentialHash - The hash of the credentials to store.
         * @param {Object} options.mintingConfig - The minting configuration for the credentials.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
        async storeCredentials({ credentialHash, mintingConfig }) {
            return new Promise((resolve, reject) => {
                axios
                    .post(
                        serverUrl + "/api/v2/credential-random",
                        {
                            config: mintingConfig,
                            credential: credentialHash,
                        },
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        /**
         * Burns the token associated with the given minting configuration on the Cardano blockchain.
         * @param {Object} options - The options for burning the token.
         * @param {Object} options.mintingConfig - The minting configuration for the token to burn.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
        async burnToken({ mintingConfig }) {
            return new Promise((resolve, reject) => {
                axios
                    .delete(serverUrl + "/api/v2/hash", {
                        ...corsConfig,
                        data: { config: mintingConfig },
                    })
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        /**
         * Burns all tokens associated with the given minting configuration on the Cardano blockchain.
         * @param {Object} options - The options for burning the tokens.
         * @param {Object} options.mintingConfig - The minting configuration for the tokens to burn.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
        async burnAllRelatedToken({ mintingConfig }) {
            return new Promise((resolve, reject) => {
                axios
                    .delete(serverUrl + "/api/v2/hash", {
                        ...corsConfig,
                        data: { config: mintingConfig, burnAll: true },
                    })
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        /**
         * Verifies the existence of a Cardano NFT with the given policy ID and optional hash of the associated document.
         * @param {Object} options - The options for verifying the NFT.
         * @param {string} options.hashOfDocument - The hash of the associated document (optional).
         * @param {string} options.policyId - The policy ID of the NFT to verify.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
        async verifyCardanoNft({ hashOfDocument, policyId }) {
            let query = { policyId };
            if (hashOfDocument) {
                query = { asset: `${policyId}${hashOfDocument}` };
            }
            return new Promise((resolve, reject) => {
                axios
                    .post(serverUrl + "/api/v2/fetch/nft", query, corsConfig)
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        /**
         * Stores a token on the Cardano blockchain with the given hash, ID, and type.
         * @param {Object} options - The options for storing the token.
         * @param {string} options.hash - The hash of the token to store.
         * @param {string} options.id - The ID of the token to store.
         * @param {string} [options.type="document"] - The type of the token to store (default: "document").
         * @param {boolean} [options.skipWait=true] - Whether to skip waiting for the transaction to be confirmed (default: true).
         * @returns {Promise} A promise that resolves with the response from the server.
         */
        async storeToken({ hash, id, type = "document", skipWait = true }) {
            return await CardanoProducer({
                data: {
                    hash,
                    type,
                },
                options: {
                    skipWait,
                },
                type: REQUEST_TYPE.CARDANO_SERVICE.mintToken,
                id,
            });
        },

        /**
         * Stores credentials on the Cardano blockchain with the given policy ID and minting configuration.
         * @param {Object} options - The options for storing the credentials.
         * @param {Object} options.credentials - The credentials to store.
         * @param {Object} options.mintingConfig - The minting configuration for the credentials.
         * @param {string} options.id - The ID of the credentials to store.
         * @param {boolean} [options.skipWait=true] - Whether to skip waiting for the transaction to be confirmed (default: true).
         * @returns {Promise} A promise that resolves with the response from the server.
         */
        async storeCredentialsWithPolicyId({
            credentials,
            mintingConfig,
            id,
            skipWait = true,
        }) {
            return await CardanoProducer({
                data: {
                    config: mintingConfig,
                    credentials: credentials,
                    type: "credential",
                },
                options: {
                    skipWait,
                },
                type: REQUEST_TYPE.CARDANO_SERVICE.mintCredential,
                id,
            });
        },

        /**
         * Updates the token associated with the given minting configuration on the Cardano blockchain with the given hash and DID.
         * @param {Object} options - The options for updating the token.
         * @param {string} options.hash - The new hash for the token.
         * @param {Object} options.mintingConfig - The minting configuration for the token to update.
         * @param {string} options.did - The DID associated with the token to update.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
        async updateToken({
            hash,
            mintingConfig,
            id,
            skipWait = true,
            type = "document",
        }) {
            return await CardanoProducer({
                data: {
                    newHash: hash,
                    config: {
                        ...mintingConfig,
                        burn: false,
                    },
                    type,
                },
                options: {
                    skipWait,
                },
                type: REQUEST_TYPE.CARDANO_SERVICE.updateToken,
                id,
            });
        },

        /**
         * Gets the endorsement chain for the NFT with the given policy ID on the Cardano blockchain.
         * @param {Object} options - The options for getting the endorsement chain.
         * @param {string} options.policyId - The policy ID of the NFT to get the endorsement chain for.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
        async getEndorsementChain({ policyId }) {
            return new Promise((resolve, reject) => {
                axios
                    .post(
                        serverUrl + "/api/v2/fetch/nft",
                        {
                            policyId,
                        },
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        /**
         * Gets the token with the given policy ID on the Cardano blockchain.
         * @param {Object} options - The options for getting the token.
         * @param {string} options.policyId - The policy ID of the token to get.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
        async getToken({ policyId }) {
            return new Promise((resolve, reject) => {
                axios
                    .post(
                        serverUrl + "/api/v2/fetch/nft",
                        {
                            policyId,
                        },
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
    };
};

export default CardanoService;
