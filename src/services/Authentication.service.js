import axios from "axios";
import dotenv from "dotenv";
import { env } from "../configs/constants.js";
import { handleServiceError } from "../configs/errors/errorHandler.js";

dotenv.config();

/**
 * Authentication service module.
 * @module AuthenticationService
 */

const AuthenticationService = () => {
    const serverUrl = env.AUTHENTICATION_SERVICE;

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
        async authenticationProgress() {
            return;
        },
    };
};

export default AuthenticationService;
