require("dotenv/config");
const Logger = require("../logger");
const SCHEMAS = require("./schemas/index");

module.exports.SERVERS = {
  DID_CONTROLLER: "http://localhost:9000",
  CARDANO_SERVICE: "http://localhost:10003",
  AUTHENTICATION_SERVICE: "http://localhost:12000",
};

Logger.info(this.SERVERS.AUTHENTICATION_SERVICE);

module.exports.SCHEMAS = SCHEMAS;

module.exports.ERRORS = {
  MISSING_PARAMETERS: {
    error_code: 400,
    error_message: "Bad request. Missing parameters.",
  },
  INVALID_INPUT: {
    error_code: 400,
    error_message: "Bad request. Invalid input syntax.",
  },
  UNAUTHORIZED: {
    error_code: 401,
    error_message: "Unauthorized. Access token is invalid.",
  },
  PERMISSION_DENIED: {
    error_code: 403,
    error_message: "Forbidden. Permission denied.",
  },
  UNVERIFIED_SIGNATURE: {
    error_code: 403,
    error_message: "Forbidden. Signature is not verified.",
  },
  NOT_FOUND: {
    error_code: 404,
    error_message: "Not found. Resource is not found.",
  },
  USER_NOT_EXIST: {
    error_code: 404,
    error_message: "Not found. User does not exist.",
  },
  ALREADY_EXSISTED: {
    error_code: 409,
    error_message: "Conflict. Resource already exsits.",
  },
  CANNOT_MINT_NFT: {
    error_code: 500,
    error_message: "Error. Cannot mint NFT.",
  },
  CANNOT_FETCH_NFT: {
    error_code: 500,
    error_message: "Error. Cannot fetch NFT.",
  },
  INVALID_STRING: {
    error_code: 400,
    error_message:
      "The string includes special characters! Please check your input again!",
  },
  INVALID_ADDRESS: {
    error_code: 400,
    error_message:
      "The input address is not existed! Please check your address again!",
  },
  SYSTEM_MISS_CONCEPTION: {
    error_code: 400,
    error_message: 'Maybe there was a consistency error in our system! Please try later!'
  }
};
