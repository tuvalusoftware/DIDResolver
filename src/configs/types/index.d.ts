interface ServiceErrorResponse {
    error_code: string;
    error_message: string;
    error_detail?: string;
}

export interface ErrorResponse {
    error_code: string;
    error_message: string;
    message?: string;
    error_detail?: string;
    detail?: string;
}

export interface ServiceResponse {
    data: any;
}
