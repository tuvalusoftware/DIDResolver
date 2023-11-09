import dotenv from "dotenv";
import { handleServiceError } from "../configs/errors/errorHandler.js";
import { validateDIDSyntax } from "../utils/index.js";
import { env } from "../configs/constants.js";
import axios from "axios";

dotenv.config();

/**
 * ControllerService is a factory function that returns an object with methods for interacting with the DID controller API.
 * @param {string} accessToken - The access token to use for authentication.
 * @returns {Object} An object with methods for interacting with the DID controller API.
 */
const ControllerService = (accessToken) => {
    const corsConfig = {
        headers: {
            Cookie: `access_token=${accessToken};`,
        },
    };
    const controllerUrl = env.DID_CONTROLLER;
    return {
        async storeCredentials({ payload }) {
            return new Promise((resolve, reject) => {
                axios
                    .post(
                        controllerUrl + "/api/v2/credential",
                        payload,
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async isExisted({ companyName, fileName }) {
            return new Promise((resolve, reject) => {
                axios
                    .get(controllerUrl + "/api/v2/doc/exists", {
                        ...corsConfig,
                        params: {
                            companyName,
                            fileName,
                        },
                    })
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async storeDocument({ companyName, fileName, wrappedDocument }) {
            return new Promise((resolve, reject) => {
                axios
                    .post(
                        controllerUrl + "/api/v2/doc",
                        {
                            companyName,
                            fileName,
                            wrappedDocument,
                        },
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async getDocumentContent({ did }) {
            return new Promise((resolve, reject) => {
                const validDid = validateDIDSyntax(did, false),
                    companyName = validDid?.companyName,
                    fileName = validDid?.fileNameOrPublicKey;
                if (!validDid.valid) {
                    reject(ERRORS.INVALID_INPUT);
                }
                axios
                    .get(controllerUrl + "/api/v2/doc", {
                        ...corsConfig,
                        params: {
                            companyName,
                            fileName,
                            only: "doc",
                        },
                    })
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async getDocumentDid({ did }) {
            return new Promise((resolve, reject) => {
                const validDid = validateDIDSyntax(did, false),
                    companyName = validDid?.companyName,
                    fileName = validDid?.fileNameOrPublicKey;
                if (!validDid.valid) {
                    reject(ERRORS.INVALID_INPUT);
                }
                axios
                    .get(controllerUrl + "/api/v2/doc", {
                        ...corsConfig,
                        params: {
                            companyName,
                            fileName,
                            only: "did",
                        },
                    })
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async getCredentialContent({ did }) {
            return new Promise((resolve, reject) => {
                axios
                    .get(
                        controllerUrl + `/api/v2/credential/${did}`,
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async updateDocumentDid({ did, didDoc }) {
            const didComponents = did.split(":");
            const companyName = didComponents[2];
            const fileName = didComponents[3];
            return new Promise((resolve, reject) => {
                axios
                    .put(
                        controllerUrl + "/api/v2/doc",
                        {
                            companyName,
                            fileName,
                            didDoc: didDoc,
                        },
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },
    };
};

export default ControllerService;
