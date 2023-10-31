/**
 * Handle server errors and return a standardized error object.
 * @param {Object} error - The error object to be handled.
 * @param {number} error.error_code - The error code.
 * @param {string} error.error_message - The error message.
 * @param {string} error.message - The error message.
 * @param {string} error.detail - The error detail.
 * @param {string} error.error_detail - The error detail.
 * @returns {Object} - A standardized error object.
 */
export const handleServerError = (error) => {
    if (error?.error_code) {
        return error;
    }
    return {
        error_code: 400,
        error_message:
            error?.error_message || error?.message || "Something went wrong!",
        error_detail: error?.detail || error?.error_detail,
    };
};
