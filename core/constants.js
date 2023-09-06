import "dotenv/config";

import {
  NOTIFICATION,
  CREDENTIAL,
  NEW_WRAPPED_DOCUMENT,
  WRAPPED_DOCUMENT,
  DID_DOCUMENT_OF_WRAPPED_DOCUMENT,
} from "./schemas/index.js";

export const SCHEMAS = {
  NEW_WRAPPED_DOCUMENT,
  WRAPPED_DOCUMENT,
  DID_DOCUMENT_OF_WRAPPED_DOCUMENT,
  CREDENTIAL,
  NOTIFICATION,
};

export const PLOT_STATUSES = {
  "F&C": {
    label: "Free & Clear",
    color: "#5EC4AC",
    description:
      "This plot has been granted an official Commonlands Certificate and is in good standing. Owners are free to utilize the plot for securing contracts if desired and have the ability to sell or trade it.",
  },
  pending: {
    label: "Pending",
    color: "#FFF9C1",
    description:
      "This plot has been established, but it is linked to a Claimchain that has not yet reached 150 undisputed plots. As a result, a certificate has not been issued. Encourage more individuals to register their plots to activate this claim.",
  },
  boundaryDispute: {
    label: "Boundary Dispute",
    color: "#FFC329",
    description:
      "This plot is experiencing one or more boundary disputes in which two or more owners acknowledge each other as neighbors but cannot agree on their shared boundaries. Although ownership of the plot is undisputed, the exact boundaries remain unclear.",
  },
  ownershipDispute: {
    label: "Ownership Dispute",
    color: "#FF7070",
    description:
      "This plot, or a portion of it, is subject to a dispute between two or more owners who do not acknowledge one another. Exercise caution in relation to any attempts to sell this plot or use it to secure contracts.",
  },
  locked: {
    label: "Locked",
    color: "#61C7DF",
    description:
      "This plot is currently being utilized to secure a contract. Due to its locked status, it cannot be used to secure additional contracts, nor can it be sold or transferred at this time.",
  },
  default: {
    label: "Default",
    color: "#DF5353",
    description:
      "This plot was previously used to secure a contract that is now in default. Exercise caution when engaging in any business transactions with the owner of this plot.",
  },
};

export const SERVERS = {
  DID_CONTROLLER: process.env.DID_CONTROLLER,
  CARDANO_SERVICE: process.env.CARDANO_SERVICE || "http://localhost:10003",
  AUTHENTICATION_SERVICE:
    process.env.AUTHENTICATION_SERVICE || "http://localhost:12000",
  ALGORAND_SERVICE: process.env.ALGORAND_SERVICE || "http://localhost:10005",
  STAGING_SERVER:
    process.env.STAGING_SERVICE || "https://commonlands-user.ap.ngrok.io/",
  COMMONLANDS_GITHUB_SERVICE:
    process.env.COMMONLANDS_GITHUB_SERVICE ||
    "https://commonlands-gitdb.ap.ngrok.io",
};

export const NETWORK_ID = {
  mainnet: "mainnet",
  testnet: "testnet",
  preview: "preview",
  preprod: "preprod",
};

export const ERRORS = {
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
    error_code: 400,
    error_message: "Error. Cannot mint NFT.",
  },
  CANNOT_FETCH_NFT: {
    error_code: 400,
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
    error_message:
      "Maybe there was a consistency error in our system! Please try later!",
  },
  CANNOT_STORE_CREDENTIAL_GITHUB_SERVICE: {
    error_code: 400,
    error_message:
      "There are some consistency errors on our systems! So we cannot store your credential on Github service now!",
  },
  CANNOT_GET_PLOT_DETAIL: {
    error_code: 400,
    error_message:
      "There are some consistency errors on our systems! So we cannot get plot detail now!",
  },
  DOCUMENT_IS_EXISTED: {
    error_code: 400,
    error_message: "Document is existed!",
  },
  CANNOT_FOUND_DID_DOCUMENT: {
    error_code: 400,
    error_message: "Cannot found DID document!",
  },
  REVOKE_DOCUMENT_FAILED: {
    error_code: 400,
    error_message: "Revoke document failed!",
  },
  CANNOT_GET_DOCUMENT_INFORMATION: {
    error_code: 400,
    error_message: "Cannot get document information!",
  },
};
