// * Utilities
import { validateDIDSyntax } from "../../core/index.js";
import axios from "axios";

// * Constants
import { SERVERS, ERRORS } from "../../core/constants.js";

const getDocumentContentByDid = async ({ did, accessToken }) => {
  try {
    const validDid = validateDIDSyntax(did, false),
      companyName = validDid.companyName,
      fileName = validDid.fileNameOrPublicKey;
    if (!validDid.valid) throw ERRORS.INVALID_INPUT;
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
      throw documentResponse.data;
    }
    return documentResponse.data;
  } catch (e) {
    throw e;
  }
};

const getDidDocumentByDid = async ({ did, accessToken }) => {
  try {
    const validDid = validateDIDSyntax(did, false),
      companyName = validDid.companyName,
      fileName = validDid.fileNameOrPublicKey;
    if (!validDid.valid) throw ERRORS.INVALID_INPUT;
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
