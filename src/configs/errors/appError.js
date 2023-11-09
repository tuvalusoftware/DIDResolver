/**
 * Custom error class for application errors.
 * @class
 * @extends Error
 */
export class AppError extends Error {
    /**
     * Creates an instance of AppError.
     * @param {Object} error - The error object containing error code and message.
     * @param {string} error.error_code - The error code.
     * @param {string} error.error_message - The error message.
     * @param {string} error_detail - The error detail.
     */
    constructor(error, error_detail) {
        super(error.error_message);
        this.name = "AppError";
        this.error_code = error.error_code;
        this.error_message = error.error_message;
        this.error_detail = error_detail;
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Get the error code.
     * @returns {string} The error code.
     */
    get code() {
        return this.error_code;
    }

    /**
     * Get the error message.
     * @returns {string} The error message.
     */
    get message() {
        return this.error_message;
    }

    /**
     * Get the error detail.
     * @returns {string} The error detail.
     */
    get detail() {
        return this.error_detail;
    }

    /**
     * Get the application error object.
     * @returns {Object} The application error object.
     * @property {string} error_code - The error code.
     * @property {string} error_message - The error message.
     * @property {string} error_detail - The error detail.
     */
    getAppError() {
        return {
            error_code: this.error_code,
            error_message: this.error_message,
            error_detail: this.error_detail,
        };
    }
}
