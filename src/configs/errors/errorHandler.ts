import { ErrorResponse } from "../types";

export const handleServerError = (error: ErrorResponse) => {
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

export const handleServiceError = (response: any) => {
    if (response.data?.error_code) {
        throw response.data;
    }
    return response;
};
