import { SERVERS } from "../../config/constants.js";
import axios from "axios";

axios.defaults.withCredentials = true;

export const ControllerHelper = {
  storeCredentials: async ({ credential, credentialHash, accessToken }) => {
    try {
      const storeCredentialStatus = await axios.post(
        SERVERS.DID_CONTROLLER + "/api/credential",
        {
          hash: credentialHash,
          content: credential,
        },
        {
          headers: {
            Cookie: `access_token=${accessToken};`,
          },
        }
      );
      return storeCredentialStatus;
    } catch (error) {
      throw error;
    }
  },
  isExisted: async ({ accessToken, companyName, fileName }) => {
    try {
      const isExistedResponse = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/doc/exists",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken}`,
          },
          params: {
            companyName: companyName,
            fileName: fileName,
          },
        }
      );
      return isExistedResponse;
    } catch (error) {
      throw error;
    }
  },
};
