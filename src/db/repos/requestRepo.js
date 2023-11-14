import { AppError } from "../../configs/errors/appError.js";
import { RequestModel } from "../models/requestModel.js";
import { ERRORS } from "../../configs/errors/error.constants.js";

const RequestRepo = {
    /**
     * Creates a single request in the database.
     * @async
     * @function
     * @param {Object} request - The request object to be created.
     * @returns {Promise<Object>} - The created request object.
     * @throws {Error} - If an error occurs while querying the database.
     */
    createRequest: async (request) => {
        try {
            const _request = await RequestModel.create(request);
            _request.save();
            return _request;
        } catch (error) {
            throw error;
        }
    },
    findOneAndUpdate: async (request, filter) => {
        try {
            const updatedRequest = await RequestModel.findOneAndUpdate(
                filter,
                request
            );
            if (!updatedRequest) {
                throw new AppError(ERRORS.NOT_FOUND);
            }
            return updatedRequest;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Retrieves a single request from the database based on a filter.
     * @async
     * @function
     * @param {Object} filter - The filter object to be used to retrieve the request.
     * @returns {Promise<Object>} - The retrieved request object.
     * @throws {Error} - If an error occurs while querying the database.
     */
    findOne: async (filter) => {
        try {
            const request = await RequestModel.findOne(filter);
            return request;
        } catch (error) {
            throw error;
        }
    },
};

export default RequestRepo;
