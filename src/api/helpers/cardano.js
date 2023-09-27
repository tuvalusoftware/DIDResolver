import axios from "axios";
import { SERVERS } from "../../config/constants.js";

axios.defaults.withCredentials = true;

export const CardanoHelper = {
  storeCredentials: async ({ credentialHash, accessToken, mintingConfig }) => {
    try {
      const credentialResponse = await axios.post(
        SERVERS.CARDANO_SERVICE + "/api/v2/credential",
        {
          config: mintingConfig,
          credential: credentialHash,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken};`,
          },
        }
      );
      return credentialResponse;
    } catch (error) {
      throw error;
    }
  },
  burnNft: async ({ mintingConfig, accessToken }) => {
    try {
      const burnNftResponse = await axios.delete(
        SERVERS.CARDANO_SERVICE + "/api/v2/hash",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken};`,
          },
          data: { config: mintingConfig },
        }
      );
      return burnNftResponse;
    } catch (error) {
      throw error;
    }
  },
};
