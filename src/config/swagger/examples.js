import { ERRORS } from "../constants.js";

export const errorMissingParameters = {
  value: {
    ...ERRORS.MISSING_PARAMETERS,
    detail: "Not found: did",
  },
};
export const errorInvalidInput = {
  value: {
    ...ERRORS.INVALID_INPUT,
    detail: "",
  },
};
export const errorUnauthorized = {
  value: {
    ...ERRORS.UNAUTHORIZED,
  },
};
export const errorPermissionDenied = {
  value: {
    ...ERRORS.PERMISSION_DENIED,
  },
};
export const errorUnverifiedSignature = {
  value: {
    ...ERRORS.UNVERIFIED_SIGNATURE,
  },
};
export const errorNotFound = {
  value: {
    ...ERRORS.NOT_FOUND,
  },
};
export const errorAlreadyExisted = {
  value: {
    ...ERRORS.ALREADY_EXSISTED,
  },
};
export const errorMintNFT = {
  value: {
    ...ERRORS.CANNOT_MINT_NFT,
  },
};
export const errorFetchNFT = {
  value: {
    ...ERRORS.CANNOT_FETCH_NFT,
  },
};

export default {};
