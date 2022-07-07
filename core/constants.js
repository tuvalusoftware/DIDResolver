const HOST = "http://18.139.84.180";
const LOCAL_HOST = "http://localhost";
const SCHEMAS = require("./schemas/index");

module.exports.SERVERS = {
  DID_CONTROLLER: `${HOST}:9000`,
  CARDANO_SERVICE: `${HOST}:10000`,
  AUTHENTICATION_SERVICE: `${HOST}:12000`,
}

module.exports.ERRORS = {
  MISSING_PARAMETERS: {
    errorCode: 400,
    errorMessage: "Bad request. Missing parameters."
  },
  INVALID_INPUT: {
    errorCode: 400,
    errorMessage: "Bad request. Invalid input syntax."
  },
  UNAUTHORIZED: {
    errorCode: 401,
    errorMessage: "Unauthorized. Access token is invalid."
  },
  PERMISSION_DENIED: {
    errorCode: 403,
    errorMessage: "Forbidden. Permission denied."
  },
  UNVERIFIED_SIGNATURE: {
    errorCode: 403,
    errorMessage: "Forbidden. Signature is not verified."
  },
  NOT_FOUND: {
    errorCode: 404,
    errorMessage: "Not found. Resource is not found."
  },
  ALREADY_EXSISTED: {
    errorCode: 409,
    errorMessage: "Conflict. Resource already exsited."
  },
  CANNOT_MINT_NFT: {
    errorCode: 500,
    errorMessage: "Error. Cannot mint NFT."
  },
  CANNOT_FETCH_NFT: {
    errorCode: 400,
    errorMessage: "Bad request. Cannot fetch NFT metadata. Check your assetId or policyId."
  }
}

module.exports.SCHEMAS = SCHEMAS;