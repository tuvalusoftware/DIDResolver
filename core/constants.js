const HOST = "http://18.139.84.180";
const LOCAL_HOST = "http://localhost";
const SCHEMAS = require("./schemas/index");

module.exports.SERVERS = {
  // CARDANO_SERVICE: `${HOST}:10003`,
  // DID_CONTROLLER: `${HOST}:9000`,
  // AUTHENTICATION_SERVICE: `${HOST}:12000`,
  AUTHENTICATION_SERVICE: `https://auth-fuixlabs.ap.ngrok.io`,
  CARDANO_SERVICE: `https://cardano-fuixlabs.ap.ngrok.io`,
  DID_CONTROLLER: `https://github-fuixlabs.ap.ngrok.io`,
  DID_RESOLVER: `https://f052-18-139-84-180.ap.ngrok.io`,
  DOC_RENDERER: `https://resolver-fuixlabs.ap.ngrok.io`,
  PAPERLESS: `https://paperless-fuixlabs.ap.ngrok.io`,
};

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
};
