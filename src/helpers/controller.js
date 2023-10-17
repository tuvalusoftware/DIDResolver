import { SERVERS } from "../config/constants.js";
import { ERRORS } from "../config/errors/error.constants.js";
import { validateDIDSyntax } from "../utils/index.js";
import axios from "axios";
axios.defaults.withCredentials = true;

/**
 * A helper object containing methods for interacting with the DID Controller API.
 * @namespace ControllerHelper
 */
/**
 * A helper object that contains methods for interacting with the DID Controller API.
 * @namespace ControllerHelper
 */
export const ControllerHelper = {
    /**
     * Stores credentials in the DID Controller API.
     * @async
     * @memberof ControllerHelper
     * @method
     * @param {Object} options - The options object.
     * @param {Object} options.payload - The payload to be stored.
     * @param {string} options.accessToken - The access token for authentication.
     * @returns {Promise} A promise that resolves with the status of the credential storage.
     * @throws {Error} An error occurred while storing the credentials.
     */
    storeCredentials: async ({ payload, accessToken }) => {
        try {
            const storeCredentialStatus = await axios.post(
                SERVERS.DID_CONTROLLER + "/api/credential",
                payload,
                {
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                }
            );
            return storeCredentialStatus;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Checks if a document with the given company name and file name already exists in the DID Controller API.
     * @async
     * @memberof ControllerHelper
     * @method
     * @param {Object} options - The options object.
     * @param {string} options.accessToken - The access token for authentication.
     * @param {string} options.companyName - The name of the company associated with the document.
     * @param {string} options.fileName - The name of the file associated with the document.
     * @returns {Promise} A promise that resolves with the response from the API.
     * @throws {Error} An error occurred while checking if the document exists.
     */
    isExisted: async ({ accessToken, companyName, fileName }) => {
        try {
            const isExistedResponse = await axios.get(
                SERVERS.DID_CONTROLLER + "/api/doc/exists",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken}`,
                    },
                    params: {
                        companyName: companyName,
                        fileName: fileName,
                    },
                }
            );
            if (isExistedResponse?.data?.error_code) {
                throw isExistedResponse?.data;
            }
            return isExistedResponse;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Stores a wrapped document in the DID Controller API.
     * @async
     * @memberof ControllerHelper
     * @method
     * @param {Object} options - The options object.
     * @param {string} options.accessToken - The access token for authentication.
     * @param {string} options.companyName - The name of the company associated with the document.
     * @param {string} options.fileName - The name of the file associated with the document.
     * @param {Object} options.wrappedDocument - The wrapped document to be stored.
     * @returns {Promise} A promise that resolves with the status of the document storage.
     * @throws {Error} An error occurred while storing the document.
     */
    storeDocument: async ({
        accessToken,
        companyName,
        fileName,
        wrappedDocument,
    }) => {
        try {
            const storeWrappedDocumentResponse = await axios.post(
                SERVERS.DID_CONTROLLER + "/api/doc",
                {
                    fileName,
                    wrappedDocument,
                    companyName,
                },
                {
                    withCredentials: true,
                    headers: { Cookie: `access_token=${accessToken};` },
                }
            );
            if(storeWrappedDocumentResponse?.data?.error_code) {
                throw storeWrappedDocumentResponse?.data;
            }
            return storeWrappedDocumentResponse;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Retrieves the content of a document with the given DID from the DID Controller API.
     * @async
     * @memberof ControllerHelper
     * @method
     * @param {Object} options - The options object.
     * @param {string} options.accessToken - The access token for authentication.
     * @param {string} options.did - The DID of the document to retrieve.
     * @returns {Promise} A promise that resolves with the response from the API.
     * @throws {Error} An error occurred while retrieving the document.
     */
    getDocumentContent: async ({ accessToken, did }) => {
        try {
            const validDid = validateDIDSyntax(did, false),
                companyName = validDid?.companyName,
                fileName = validDid?.fileNameOrPublicKey;
            if (!validDid.valid) {
                throw ERRORS.INVALID_INPUT;
            }
            const documentResponse = await axios.get(
                SERVERS.DID_CONTROLLER + "/api/doc",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken}`,
                    },
                    params: { companyName, fileName, only: "doc" },
                }
            );
            if (documentResponse?.data?.error_code) {
                throw documentResponse?.data;
            }
            return documentResponse;
        } catch (error) {
            throw error;
        }
    },
    getDocumentDid: async ({ accessToken, did }) => {
        try {
            const validDid = validateDIDSyntax(did, false),
                companyName = validDid.companyName,
                fileName = validDid.fileNameOrPublicKey;
            if (!validDid.valid) {
                throw ERRORS.INVALID_INPUT;
            }
            const documentResponse = await axios.get(
                SERVERS.DID_CONTROLLER + "/api/doc",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken}`,
                    },
                    params: { companyName, fileName, only: "did" },
                }
            );
            if (documentResponse?.data?.error_code) {
                throw documentResponse.data;
            }
            return documentResponse;
        } catch (e) {
            throw e;
        }
    },
    updateDocumentDid: async ({ did, accessToken, didDoc }) => {
        try {
            const didComponents = did.split(":");
            const companyName = didComponents[2];
            const fileName = didComponents[3];
            const createUserDidReq = await axios.put(
                SERVERS.DID_CONTROLLER + "/api/doc",
                {
                    companyName,
                    fileName,
                    didDoc: didDoc,
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                }
            );
            if (createUserDidReq?.data?.error_code) {
                throw createUserDidReq.data;
            }
            return createUserDidReq;
        } catch (e) {
            throw e;
        }
    },
    getCredentialContent: async ({ accessToken, did }) => {
        try {
            const credentialResponse = await axios.get(
                SERVERS.DID_CONTROLLER + `/api/credential/${did}`,
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken};`,
                    },
                }
            );
            if (credentialResponse?.data?.error_code) {
                throw credentialResponse?.data;
            }
            return credentialResponse;
        } catch (e) {
            throw e;
        }
    },
};
