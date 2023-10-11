import { REQUEST_TYPE } from "../config/constants.js";
import { ERRORS } from "../config/errors/error.constants.js";
import QUEUE_SCHEMA from "../config/schemas/taskQueue.js";
import { validateJSONSchema } from "../api/utils/index.js";
import { SERVERS } from "../config/constants.js";
import axios from "axios";

/**
 * A helper object containing methods for sending minting requests to the task queue service.
 * @namespace TaskQueueHelper
 */
export const TaskQueueHelper = {
    /**
     * Sends a minting request to the task queue service.
     * @async
     * @memberof TaskQueueHelper
     * @method sendMintingRequest
     * @param {Object} options - The options for the minting request.
     * @param {Object} options.data - The data for the minting request.
     * @param {string} options.type - The type of minting request.
     * @param {string} options.did - The DID associated with the minting request.
     * @returns {Promise<Object>} - A promise that resolves with the response from the task queue service.
     * @throws {Error} - If the minting type is invalid or the input data is invalid.
     */
    sendMintingRequest: async ({ data, type, did }) => {
        try {
            let requestType, verifierSchema;
            switch (type) {
                case REQUEST_TYPE.MINT: {
                    requestType = REQUEST_TYPE.MINT;
                    verifierSchema = QUEUE_SCHEMA.MINT_DATA;
                    break;
                }
                case REQUEST_TYPE.BURN: {
                    requestType = REQUEST_TYPE.BURN;
                    verifierSchema = QUEUE_SCHEMA.BURN_DATA;
                    break;
                }
                case REQUEST_TYPE.UPDATE:
                    requestType = REQUEST_TYPE.UPDATE;
                    verifierSchema = QUEUE_SCHEMA.UPDATE_DATA;
                    break;
                case REQUEST_TYPE.MINT_CREDENTIAL:
                    requestType = REQUEST_TYPE.MINT_CREDENTIAL;
                    verifierSchema = QUEUE_SCHEMA.CREATE_CREDENTIAL_DATA;
                    break;
                case REQUEST_TYPE.PLOT_MINT:
                    requestType = REQUEST_TYPE.PLOT_MINT;
                    verifierSchema = QUEUE_SCHEMA.MINT_DATA;
                    break;
                case REQUEST_TYPE.ADD_CLAIMANT:
                    requestType = REQUEST_TYPE.ADD_CLAIMANT;
                    verifierSchema = QUEUE_SCHEMA.CREATE_CREDENTIAL_DATA;
                    break;
                default:
                    throw new Error("Invalid minting type.");
            }
            const validateData = validateJSONSchema(verifierSchema, data);
            if (!validateData.valid) {
                throw ERRORS.INVALID_INPUT;
            }
            const requestResponse = await axios.post(
                SERVERS.TASK_QUEUE_SERVICE + "/api/mint",
                {
                    request: {
                        data,
                        type: requestType,
                        did: did,
                    },
                }
            );
            if (requestResponse?.data?.error_code) {
                throw requestResponse.data || ERRORS.PUSH_TO_TASK_QUEUE_FAILED;
            }
            return requestResponse;
        } catch (error) {
            throw error;
        }
    },
    isExisted: async ({ did }) => {
        try {
            const requestResponse = await axios.get(
                SERVERS.TASK_QUEUE_SERVICE + `/api/db/isExists/${did}`
            );
            if (requestResponse?.data?.error_code) {
                throw requestResponse.data || ERRORS.PUSH_TO_TASK_QUEUE_FAILED;
            }
            return requestResponse;
        } catch (error) {
            throw error;
        }
    },
};
