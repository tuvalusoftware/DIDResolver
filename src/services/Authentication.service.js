import axios from "axios";
import dotenv from "dotenv";
import jwt_decode from "jwt-decode";
import { env } from "../configs/constants.js";
import { handleServiceError } from "../configs/errors/errorHandler.js";
import { getAccountBySeedPhrase, signData } from "../utils/lucid.js";
import { getPublicKeyFromAddress } from "../utils/index.js";

dotenv.config();

/**
 * Authentication service module.
 * @module AuthenticationService
 */

const AuthenticationService = () => {
    const serverUrl = env.AUTHENTICATION_SERVICE;

    /**
     * Get random number encryption from server.
     * @async
     * @function getRandomNumberEncryption
     * @returns {Promise<string>} Promise object representing the random number encryption.
     * @throws {Error} If there is an error while getting random number from server.
     */
    async function getRandomNumberEncryption() {
        return new Promise((resolve, reject) => {
            axios
                .get(serverUrl + "/api/auth/getRandomNumber")
                .then((response) => {
                    if (!response?.data) {
                        reject(
                            new Error(
                                "Error while getting random number from server"
                            )
                        );
                    }
                    resolve(response?.data?.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Get authentication token from server.
     * @async
     * @function getAuthenticationToken
     * @param {Object} params - The parameters for getting authentication token.
     * @param {string} params.randomNumber - The random number.
     * @param {string} params.timestamp - The timestamp.
     * @param {string} params.signedData - The signed data.
     * @param {string} params.address - The address.
     * @param {string} params.accessToken - The access token.
     * @returns {Promise<string>} Promise object representing the authentication token.
     * @throws {Error} If there is an error while getting authentication token from server.
     */
    async function getAuthenticationToken({
        randomNumber,
        timestamp,
        signedData,
        address,
        accessToken,
    }) {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    serverUrl + `/api/auth/v2/login?network=Cardano`,
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
                )
                .then((response) => {
                    handleServiceError(response);
                    resolve(response?.data?.data?.access_token);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    return {
        /**
         * Get authentication progress.
         * @async
         * @function authenticationProgress
         * @returns {Promise<string>} Promise object representing the authentication progress.
         */
        async authenticationProgress() {
            const randomNumberEncryption = await getRandomNumberEncryption();
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
            const accessToken = await getAuthenticationToken({
                randomNumber,
                timestamp,
                signedData: signMessage,
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                accessToken: randomNumberEncryption?.access_token,
            });
            return accessToken;
        },
    };
};

export default AuthenticationService;
