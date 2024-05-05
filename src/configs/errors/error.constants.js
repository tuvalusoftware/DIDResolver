const ERRORS = {
    MISSING_PARAMETERS: {
        error_code: 4001,
        error_message: "Bad request. Missing parameters.",
    },
    INVALID_INPUT: {
        error_code: 4002,
        error_message: "Bad request. Invalid input syntax.",
    },
    UNAUTHORIZED: {
        error_code: 4003,
        error_message: "Unauthorized. Access token is invalid.",
    },
    PERMISSION_DENIED: {
        error_code: 4004,
        error_message: "Forbidden. Permission denied.",
    },
    UNVERIFIED_SIGNATURE: {
        error_code: 4005,
        error_message: "Forbidden. Signature is not verified.",
    },
    NOT_FOUND: {
        error_code: 4006,
        error_message: "Not found. Resource is not found.",
    },
    USER_NOT_EXIST: {
        error_code: 4007,
        error_message: "Not found. User does not exist.",
    },
    ALREADY_EXSISTED: {
        error_code: 4008,
        error_message: "Conflict. Resource already exists.",
    },
    CANNOT_MINT_NFT: {
        error_code: 4009,
        error_message: "Error. Cannot mint NFT.",
    },
    CANNOT_FETCH_NFT: {
        error_code: 4010,
        error_message: "Error. Cannot fetch NFT.",
    },
    INVALID_STRING: {
        error_code: 4011,
        error_message:
            "The string includes special characters! Please check your input again!",
    },
    INVALID_ADDRESS: {
        error_code: 4012,
        error_message:
            "The input address is not existed! Please check your address again!",
    },
    SYSTEM_MISS_CONCEPTION: {
        error_code: 4013,
        error_message:
            "Maybe there was a consistency error in our system! Please try later!",
    },
    CANNOT_STORE_CREDENTIAL_GITHUB_SERVICE: {
        error_code: 4014,
        error_message:
            "There are some consistency errors on our systems! So we cannot store your credential on Github service now!",
    },
    CANNOT_GET_PLOT_DETAIL: {
        error_code: 4015,
        error_message:
            "There are some consistency errors on our systems! So we cannot get plot detail now!",
    },
    DOCUMENT_IS_EXISTED: {
        error_code: 4016,
        error_message: "Document is existed!",
    },
    CANNOT_FOUND_DID_DOCUMENT: {
        error_code: 4017,
        error_message: "Cannot found DID document!",
    },
    REVOKE_DOCUMENT_FAILED: {
        error_code: 4018,
        error_message: "Revoke document failed!",
    },
    CANNOT_GET_DOCUMENT_INFORMATION: {
        error_code: 4019,
        error_message: "Cannot get document information!",
    },
    COMMONLANDS_CONTRACT_IS_NOT_VALID: {
        error_code: 4020,
        error_message: "Commonlands contract is not valid!",
    },
    VERIFIABLE_CREDENTIAL_IS_NOT_VALID: {
        error_code: 4021,
        error_message: "Verifiable credential is not valid!",
    },
    CONTRACT_IS_NOT_VALID: {
        error_code: 4022,
        error_message: "Contract is not valid!",
    },
    CREDENTIAL_FAILED: {
        error_code: 4023,
        error_message: "Error when create credential!",
    },
    INVALID_DID: {
        error_code: 4024,
        error_message: "Invalid DID syntax!",
    },
    CANNOT_UPDATE_DOCUMENT_INFORMATION: {
        error_code: 4025,
        error_message: "Cannot update document information!",
    },
    NO_CREDENTIALS_FOUND: {
        error_code: 4026,
        error_message: "There are no credentials rely on this contract!",
    },
    CANNOT_GET_DID_DOCUMENT: {
        error_code: 4027,
        error_message: "Error while getting DID document",
    },
    ERROR_PUSH_URL_TO_DID_DOCUMENT: {
        error_code: 4028,
        error_message: "Error while pushing url to DID document",
    },
    CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT: {
        error_code: 4029,
        error_message: "Error while creating credential for claimant",
    },
    MISSING_REQUIRED_PARAMETERS: {
        error_code: 4030,
        error_message: "Missing required parameters in object",
    },
    CERTIFICATE_IS_NOT_VALID: {
        error_code: 4031,
        error_message: "Certificate is invalid!",
    },
    CONNECTION_TIMEOUT: {
        error_code: 4032,
        error_message: "Cannot reach the service.",
    },
    CONNECTION_REFUSED: {
        error_code: 4033,
        error_message: "Service refused to connect.",
    },
    CERTIFICATE_DID_IS_LOCKED_WITH_CONTRACT: {
        error_code: 4034,
        error_message: "Certificate DID is locked with another loan contract!",
    },
    CERTIFICATE_DID_IS_NOT_LOCKED_WITH_CONTRACT: {
        error_code: 4035,
        error_message: "Certificate DID is not locked with any loan contract!",
    },
    CANNOT_GET_CONTRACT_URL: {
        error_code: 4036,
        error_message: "Cannot get url from DID Document!",
    },
    CANNOT_STORE_DOCUMENT: {
        error_code: 4037,
        error_message: "Cannot store document!",
    },
    PUSH_TO_TASK_QUEUE_FAILED: {
        error_code: 4038,
        error_message: "Push to task queue failed!",
    },
    DOCUMENT_IS_NOT_EXISTED: {
        error_code: 4039,
        error_message: "Document is not existed!",
    },
    DOCUMENT_IS_NOT_LASTEST_VERSION: {
        error_code: 4040,
        error_message: "Document is not lastest version!",
    },
    PROMISE_ALL_SETTLED: {
        error_code: 4041,
        error_message:
            "Not all promises is settled when involving Promise.AllSettled().",
    },
    DOCUMENT_TYPE_IS_NOT_VALID: {
        error_code: 4042,
        error_message: "Document type is not valid!",
    },

    // Internal server errors
    INTERNAL_SERVER_ERROR: {
        error_code: 5001,
        error_message: "Internal server error.",
    },

    RABBIT_MESSAGE_ERROR: {
        error_code: 5002,
        error_message: "RabbitMQ message error.",
    },
};

export { ERRORS };
