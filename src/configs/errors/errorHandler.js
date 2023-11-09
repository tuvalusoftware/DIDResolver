import { AppError } from "./appError.js";

/**
 * Handles service errors by checking if the response contains an error object.
 * If an error object is found, the promise is rejected with the error object.
 * Otherwise, the promise is resolved with the response.
 * @param {Object} response - The response object from the service.
 * @returns {Promise} A promise that resolves with the response or rejects with the error object.
 */
export const handleServiceError = (response) => {
    if (response.data?.error_code) {
        throw new AppError(response.data);
    }
    return response;
};
