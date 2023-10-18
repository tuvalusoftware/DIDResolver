import axios from "axios";
import { SERVERS } from "../config/constants.js";
import { ERRORS } from "../config/errors/error.constants.js";

axios.defaults.withCredentials = true;

/**
 * A helper object for interacting with the Cardano blockchain.
 * @namespace CardanoHelper
 */
export const CardanoHelper = {
    /**
     * Sends a POST request to the Cardano service to generate a random credential.
     * @async
     * @function
     * @memberof CardanoHelper
     * @param {Object} options - The options object.
     * @param {string} options.credentialHash - The hash of the credential.
     * @param {string} options.accessToken - The access token for authentication.
     * @param {Object} options.mintingConfig - The configuration object for minting.
     * @returns {Promise<Object>} - A promise that resolves to the credential response object.
     */
    storeCredentials: async ({
        credentialHash,
        accessToken,
        mintingConfig,
    }) => {
        try {
            const credentialResponse = await axios.post(
                SERVERS.CARDANO_SERVICE + "/api/v2/credential-random",
                {
                    config: mintingConfig,
                    credential: credentialHash,
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                }
            );
            if(credentialResponse?.data?.code !== 0) {
                throw ERRORS.CANNOT_MINT_NFT;
            }
            return credentialResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Deletes an NFT from the Cardano blockchain by sending a DELETE request to the Cardano service API.
     * @async
     * @function
     * @memberof CardanoHelper
     * @param {Object} options - The options object.
     * @param {string} options.accessToken - The access token for the user making the request.
     * @param {Object} options.mintingConfig - The configuration object for the NFT minting.
     * @returns {Promise<Object>} - A promise that resolves with the response data from the Cardano service API.
     */
    burnToken: async ({ mintingConfig, accessToken }) => {
        try {
            const burnTokenResponse = await axios.delete(
                SERVERS.CARDANO_SERVICE + "/api/v2/hash",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                    data: { config: mintingConfig },
                }
            );
            if (burnTokenResponse?.data?.code !== 0) {
                throw ERRORS.REVOKE_DOCUMENT_FAILED;
            }
            return burnTokenResponse;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Deletes an NFT from the Cardano blockchain by sending a DELETE request to the Cardano service API.
     * @async
     * @function
     * @memberof CardanoHelper
     * @param {Object} options - The options object.
     * @param {string} options.accessToken - The access token for the user making the request.
     * @param {Object} options.mintingConfig - The configuration object for the NFT minting.
     * @returns {Promise<Object>} - A promise that resolves with the response data from the Cardano service API.
     */
    burnAllRelatedToken: async ({ mintingConfig, accessToken }) => {
        try {
            const burnTokenResponse = await axios.delete(
                SERVERS.CARDANO_SERVICE + "/api/v2/hash",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                    data: { config: mintingConfig, burnAll: true },
                }
            );
            if (burnTokenResponse?.data?.code !== 0) {
                throw ERRORS.REVOKE_DOCUMENT_FAILED;
            }
            return burnTokenResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Verifies an NFT on the Cardano blockchain by sending a POST request to the Cardano service API.
     * @async
     * @function
     * @memberof CardanoHelper
     * @param {Object} options - The options object.
     * @param {string} options.hashofdocument - The hash of the document.
     * @param {string} options.policyid - The policy ID of the NFT.
     * @param {string} options.accessToken - The access token for authentication.
     * @returns {Promise<void>} - A promise that resolves when the NFT is verified.
     * @throws {ERRORS.CANNOT_FETCH_NFT} - If the NFT cannot be fetched.
     */
    verifyCardanoNft: async ({ hashofdocument, policyid, accessToken }) => {
        let query = { policyId: policyid };
        if (hashofdocument) {
            query = { asset: `${policyid}${hashofdocument}` };
        }
        const { data } = await axios.post(
            `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
            query,
            {
                withCredentials: true,
                headers: {
                    Cookie: `access_token=${accessToken}`,
                },
            }
        );
        if (data?.code !== 0) {
            throw ERRORS.CANNOT_FETCH_NFT;
        }
    },

    /**
     * Sends a POST request to the Cardano service to store a token.
     * @async
     * @function
     * @memberof CardanoHelper
     * @param {Object} options - The options object.
     * @param {string} options.hash - The hash of the token.
     * @param {string} options.accessToken - The access token for authentication.
     * @returns {Promise<Object>} - A promise that resolves to the token response object.
     */
    storeToken: async ({ hash, accessToken }) => {
        try {
            const tokenResponse = await axios.post(
                SERVERS.CARDANO_SERVICE + "/api/v2/hash-random",
                {
                    hash,
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                }
            );
            if (tokenResponse?.data?.code !== 0) {
                throw ERRORS.CANNOT_MINT_NFT;
            }
            return tokenResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Sends a POST request to the Cardano service to generate a random credential with a policy ID.
     * @async
     * @function
     * @memberof CardanoHelper
     * @param {Object} options - The options object.
     * @param {Object} options.credentials - The credentials object.
     * @param {Object} options.mintingConfig - The configuration object for minting the credential.
     * @param {string} options.accessToken - The access token for authentication.
     * @returns {Promise<Object>} - A promise that resolves to the credential response object.
     */
    storeCredentialsWithPolicyId: async ({
        credentials,
        mintingConfig,
        accessToken,
    }) => {
        try {
            /**
             * Sends a POST request to the Cardano service to generate a random credential.
             *
             * @param {Object} mintingConfig - The configuration object for minting the credential.
             * @param {Object} credentials - The credentials object.
             * @param {string} accessToken - The access token for authentication.
             * @returns {Promise<Object>} - A promise that resolves to the credential response object.
             */
            const credentialResponse = await axios.post(
                SERVERS.CARDANO_SERVICE + "/api/v2/credentials",
                {
                    config: mintingConfig,
                    credentials: credentials,
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                }
            );
            return credentialResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update the hash, config, and DID on the Cardano service.
     * @param {string} hash - The hash to update.
     * @param {Object} mintingConfig - The minting configuration object.
     * @param {string} did - The DID to update.
     * @param {string} accessToken - The access token for authentication.
     * @returns {Promise<Object>} - The response object from the Cardano service.
     */
    updateToken: async ({ hash, accessToken, mintingConfig, did }) => {
        try {
            const didComponents = did.split(":");
            const updateResponse = await axios.put(
                SERVERS.CARDANO_SERVICE + "/api/v2/hash/",
                {
                    newHash: hash,
                    config: {
                        ...mintingConfig,
                        burn: false,
                    },
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                }
            );
            return updateResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Fetches the endorsement chain response from the Cardano service API.
     * @async
     * @function getEndorsementChainResponse
     * @param {string} policyId - The policy ID of the NFT.
     * @param {string} accessToken - The access token for authentication.
     * @returns {Promise<Object>} The endorsement chain response object.
     */
    getEndorsementChain: async ({ policyId, accessToken }) => {
        try {
            const getEndorsementChainResponse = await axios.post(
                `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
                {
                    policyId: policyId,
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                }
            );
            if (getEndorsementChainResponse?.data?.code !== 0) {
                throw ERRORS.CANNOT_FETCH_NFT;
            }
            return getEndorsementChainResponse?.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Fetches NFT data from the Cardano service API.
     *
     * @param {string} policyId - The policy ID of the NFT to fetch.
     * @param {string} accessToken - The access token for authentication.
     * @returns {Promise<Object>} - A promise that resolves to the NFT data object.
     */
    getToken: async ({ policyId, accessToken }) => {
        try {
            const getTokenResponse = await axios.post(
                `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
                {
                    policyId: policyId,
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                }
            );
            if (getTokenResponse?.data?.code !== 0) {
                throw ERRORS.CANNOT_FETCH_NFT;
            }
            return getTokenResponse;
        } catch (error) {
            throw error;
        }
    },
};
