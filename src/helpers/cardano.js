import axios from "axios";
import { SERVERS } from "../config/constants.js";
import { ERRORS } from "../config/errors/error.constants.js";

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
  verifyCardanoNft: async ({ hashofdocument, policyid, accessToken }) => {
    let query = { policyId: policyid };
    if (hashofdocument) {
      query = { asset: `${policyid}${hashofdocument}` };
    }
    const { data } = await axios.post(
      `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
      query,
      {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${accessToken}`,
        },
      }
    );
    if (!data?.data[0]?.asset) {
      throw ERRORS.CANNOT_FETCH_NFT;
    }
  },
};
