import "dotenv/config";

// * Utilities
import axios from "axios";
import { getAccountBySeedPhrase, signData } from "../utils/lucid.js";

// * Constants
import { SERVERS } from "../config/constants.js";
import jwt_decode from "jwt-decode";
import { getPublicKeyFromAddress } from "../utils/index.js";

/**
 * Helper functions for authentication.
 * @namespace AuthHelper
 */
export const AuthHelper = {
    /**
     * Get authentication token from server.
     * @async
     * @function getAuthenticationToken
     * @memberof AuthHelper
     * @param {Object} params - The parameters for authentication.
     * @param {string} params.randomNumber - The random number for authentication.
     * @param {string} params.timestamp - The timestamp for authentication.
     * @param {string} params.signedData - The signed data for authentication.
     * @param {string} params.address - The address for authentication.
     * @param {string} params.accessToken - The access token for authentication.
     * @returns {Promise<string>} The authentication token.
     * @throws {Object} The error object returned by the server.
     */
    getAuthenticationToken: async ({
        randomNumber,
        timestamp,
        signedData,
        address,
        accessToken,
    }) => {
        try {
            const loginResponse = await axios.post(
                `${SERVERS?.AUTHENTICATION_SERVICE}/api/auth/v2/login?network=Cardano`,
                {
                    randomNumber,
                    timestamp,
                    signedData,
                    address,
                    network: "Cardano",
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken}`,
                    },
                }
            );
            if (loginResponse?.data?.error_code) {
                throw loginResponse?.data;
            }
            return loginResponse?.data?.data?.access_token;
        } catch (e) {
            throw e;
        }
    },

    /**
     * Get random number encryption from server.
     * @async
     * @function getRandomNumberEncryption
     * @memberof AuthHelper
     * @returns {Promise<string>} The random number encryption.
     * @throws {Error} Error while getting random number from server.
     */
    getRandomNumberEncryption: async () => {
        try {
            const randomNumberResponse = await axios.get(
                `${SERVERS.AUTHENTICATION_SERVICE}/api/auth/getRandomNumber`
            );
            if (!randomNumberResponse?.data)
                throw new Error(
                    "Error while getting random number from server"
                );
            return randomNumberResponse?.data?.data;
        } catch (e) {
            throw e;
        }
    },

    /**
     * Perform authentication progress.
     * @async
     * @function authenticationProgress
     * @memberof AuthHelper
     * @returns {Promise<string>} The authentication token.
     * @throws {Object} The error object returned by the server.
     */
    authenticationProgress: async () => {
        try {
            const randomNumberEncryption =
                await AuthHelper.getRandomNumberEncryption();
            const decodedData = jwt_decode(
                randomNumberEncryption?.access_token
            );
            const { randomNumber, timestamp } = decodedData?.data;
            const { currentWallet } = await getAccountBySeedPhrase({
                seedPhrase: process.env.ADMIN_SEED_PHRASE,
            });

            const signMessage = await signData(
                getPublicKeyFromAddress(currentWallet?.paymentAddr),
                Buffer.from(
                    JSON.stringify({
                        randomNumber,
                        timestamp,
                    }),
                    "utf8"
                ).toString("hex"),
                process?.env?.ADMIN_PASSWORD,
                0
            );
            const accessToken = await AuthHelper.getAuthenticationToken({
                randomNumber,
                timestamp,
                signedData: signMessage,
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                accessToken: randomNumberEncryption?.access_token,
            });
            return accessToken;
        } catch (e) {
            throw e;
        }
    },
};
