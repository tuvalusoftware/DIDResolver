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
        /**
         * Stores a credential in the DID controller.
         * @param {Object} payload - The credential to store.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
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
        /**
         * Checks if a document with the given company name and file name exists in the DID controller.
         * @param {Object} params - An object containing the company name and file name to check.
         * @param {string} params.companyName - The name of the company associated with the document.
         * @param {string} params.fileName - The name of the file associated with the document.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
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
        /**
         * Stores a document in the DID controller.
         * @param {Object} params - An object containing the company name, file name, and wrapped document to store.
         * @param {string} params.companyName - The name of the company associated with the document.
         * @param {string} params.fileName - The name of the file associated with the document.
         * @param {string} params.wrappedDocument - The wrapped document to store.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
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
        /**
         * Gets the content of a document with the given DID from the DID controller.
         * @param {Object} params - An object containing the DID to get the document content for.
         * @param {string} params.did - The DID to get the document content for.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
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
        /**
         * Gets the DID of a document with the given DID from the DID controller.
         * @param {Object} params - An object containing the DID to get the document DID for.
         * @param {string} params.did - The DID to get the document DID for.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
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
        /**
         * Gets the content of a credential with the given DID from the DID controller.
         * @param {Object} params - An object containing the DID to get the credential content for.
         * @param {string} params.did - The DID to get the credential content for.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
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
        /**
         * Updates the DID of a document with the given DID in the DID controller.
         * @param {Object} params - An object containing the DID to update and the new DID.
         * @param {string} params.did - The DID to update.
         * @param {string} params.didDoc - The new DID to set for the document.
         * @returns {Promise} A promise that resolves with the response from the server.
         */
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
