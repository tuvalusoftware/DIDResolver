// * Utilities
import { validateDIDSyntax } from "../../core/index.js";
import Logger from "../../logger.js";
import axios from "axios";

// * Constants
import { SERVERS, ERRORS } from "../../core/constants.js";

/**
 * Function used for getting document content from DID Controller
 * @param {String} did
 * @param {String} accessToken
 * @returns {Object} - document content
 */
const getDocumentContentByDid = async ({ did, accessToken }) => {
  try {
    const validDid = validateDIDSyntax(did, false),
      companyName = validDid?.companyName,
      fileName = validDid?.fileNameOrPublicKey;
    if (!validDid.valid) {
      Logger.error(`Invalid DID: ${did}`);
      throw ERRORS.INVALID_INPUT;
    }
    const documentResponse = await axios.get(
      SERVERS.DID_CONTROLLER + "/api/doc",
      {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${accessToken}`,
        },
        params: { companyName, fileName, only: "doc" },
      }
    );
    if (documentResponse?.data?.error_code) {
      throw documentResponse?.data;
    }
    return documentResponse?.data;
  } catch (e) {
    throw e;
  }
};

/**
 * Function used for getting DID document from DID Controller
 * @param {String} did
 * @param {String} accessToken
 * @returns {Object} - DID document
 */
const getDidDocumentByDid = async ({ did, accessToken }) => {
  try {
    const validDid = validateDIDSyntax(did, false),
      companyName = validDid.companyName,
      fileName = validDid.fileNameOrPublicKey;
    if (!validDid.valid) {
      Logger.apiError(`Invalid DID: ${did}`);
      throw ERRORS.INVALID_INPUT;
    }
    const documentResponse = await axios.get(
      SERVERS.DID_CONTROLLER + "/api/doc",
      {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${accessToken}`,
        },
        params: { companyName, fileName, only: "did" },
      }
    );
    if (documentResponse?.data?.error_code) {
      throw documentResponse.data;
    }
    return documentResponse.data;
  } catch (e) {
    throw e;
  }
};

export { getDocumentContentByDid, getDidDocumentByDid };
