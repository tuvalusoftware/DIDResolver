import { RequestModel } from "../model/requestModel.js";
import { REQUEST_STATUS } from "../../src/config/constants.js";

/**
 * Request repository object containing methods to interact with the database.
 * @namespace RequestRepo
 */
export const RequestRepo = {
    /**
     * Finds the latest pending request in the database.
     * @async
     * @function findLastestPendingRequest
     * @memberof RequestRepo
     * @returns {Promise<Object>} The latest pending request object.
     * @throws {Error} If an error occurs while querying the database.
     */
    findLastestPendingRequest: async () => {
        try {
            const lastestRequest = await RequestModel.findOne({
                status: "pending",
            }).sort({ createdAt: -1 });
            return lastestRequest;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Creates multiple requests in the database.
     * @async
     * @function createRequests
     * @memberof RequestRepo
     * @param {Array<Object>} requests - An array of request objects to be created.
     * @returns {Promise<Array<Object>>} An array of created request objects.
     * @throws {Error} If an error occurs while querying the database.
     */
    createRequests: async (requests) => {
        try {
            const _requests = await RequestModel.insertMany(requests);
            return _requests;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Creates a single request in the database.
     * @async
     * @function createRequest
     * @memberof RequestRepo
     * @param {Object} request - The request object to be created.
     * @returns {Promise<Object>} The created request object.
     * @throws {Error} If an error occurs while querying the database.
     */
    createRequest: async (request) => {
        try {
            const _request = await RequestModel.create(request);
            return _request;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Updates the status of a request to "completed" in the database.
     * @async
     * @function updateDoneStatusRequest
     * @memberof RequestRepo
     * @param {Object} options - An object containing the request DID and response.
     * @param {string} options.requestDid - The DID of the request to be updated.
     * @param {Object} options.response - The response object to be added to the request.
     * @returns {Promise<Object>} The updated request object.
     * @throws {Error} If an error occurs while querying the database.
     */
    updateDoneStatusRequest: async ({ requestDid, response }) => {
        try {
            const updatedRequest = await RequestModel.findOneAndUpdate(
                {
                    did: requestDid,
                },
                {
                    status: REQUEST_STATUS.COMPLETED,
                    completedAt: Date.now(),
                    response,
                }
            );
            return updatedRequest;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retrieves a request from the database based on a filter.
     * @async
     * @function retrieveRequest
     * @memberof RequestRepo
     * @param {Object} filter - The filter object to be used to retrieve the request.
     * @returns {Promise<Object>} The retrieved request object.
     * @throws {Error} If an error occurs while querying the database.
     */
    retrieveRequest: async (filter) => {
        try {
            const request = await RequestModel.findOne(filter);
            return request;
        } catch (error) {
            throw error;
        }
    },
};
