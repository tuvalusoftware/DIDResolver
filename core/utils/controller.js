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

/**
 *
 * @param {String} did - DID of the document
 * @param {String} accessToken - access token of the user
 * @param {Object} didDoc - Did document need to be updated
 * @return {Object} - updated document
 */
const updateDocumentDid = async ({ did, accessToken, didDoc }) => {
  try {
    const didComponents = did.split(":");
    const companyName = didComponents[2];
    const fileName = didComponents[3];
    const createUserDidReq = await axios.put(
      SERVERS.DID_CONTROLLER + "/api/doc",
      {
        companyName,
        fileName,
        didDoc: didDoc,
      },
      {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${accessToken};`,
        },
      }
    );
    return createUserDidReq.data;
  } catch (e) {
    throw e;
  }
};

/**
 *
 * @param {String} did
 * @param {String} accessToken
 * @returns
 */
const retrieveDocumentDid = async ({ did, accessToken }) => {
  try {
    const didComponents = did.split(":");
    const companyName = didComponents[2];
    const publicKey = didComponents[3];
    const didResponse = await axios.get(SERVERS.DID_CONTROLLER + "/api/did", {
      withCredentials: true,
      headers: {
        Cookie: `access_token=${accessToken};`,
      },
      params: {
        companyName,
        publicKey,
      },
    });
    return didResponse?.data;
  } catch (e) {
    throw e;
  }
};

/**
 *
 * @param {String} hash
 * @param {String} accessToken
 * @returns
 */
const getCredential = async ({ hash, accessToken }) => {
  try {
    const credentialResponse = await axios.get(
      SERVERS.DID_CONTROLLER + "/api/credential",
      {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${accessToken};`,
        },
        params: {
          hash,
        },
      }
    );
    if (credentialResponse?.data?.error_code) {
      throw credentialResponse;
    }
    return credentialResponse;
  } catch (e) {
    throw e;
  }
};

export {
  getDocumentContentByDid,
  getDidDocumentByDid,
  updateDocumentDid,
  retrieveDocumentDid,
  getCredential,
};
