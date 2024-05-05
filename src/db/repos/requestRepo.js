import { AppError } from "../../configs/errors/appError.js";
import { RequestModel } from "../models/requestModel.js";
import { ERRORS } from "../../configs/errors/error.constants.js";

const RequestRepo = {
    /**
     * Creates a new request.
     *
     * @param {Object} request - The request object.
     * @returns {Promise<Object>} The created request object.
     */
    async createRequest(request) {
        return await RequestModel.create(request);
    },
    /**
     * Finds a document that matches the filter and updates it with the provided request.
     * @param {Object} request - The request object to update the document with.
     * @param {Object} filter - The filter object to find the document to update.
     * @returns {Promise<Object>} - The updated request object.
     * @throws {AppError} - If the document is not found.
     */
    async findOneAndUpdate(request, filter) {
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
     * Finds a single document in the database that matches the given filter.
     *
     * @param {Object} filter - The filter object used to search for the document.
     * @returns {Promise<Object|null>} - A promise that resolves to the found document, or null if not found.
     */
    async findOne(filter) {
        return await RequestModel.findOne(filter);
    },
};

export default RequestRepo;
