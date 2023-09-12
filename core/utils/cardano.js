// * Utilities
import axios from "axios";

// * Constants
import { SERVERS, ERRORS } from "../constants.js";

/**
 * Function used for verifying dose the given document exist on the blockchain
 * @param {String} hashofdocument
 * @param {String} policyid 
 * @param {String} accessToken
 * @returns {Object} 
 */
const verifyCardanoNft = async ({ hashofdocument, policyid, accessToken }) => {
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
  if (!data?.data?.asset) {
    throw ERRORS.CANNOT_FETCH_NFT;
  }
};

/**
 * Function used for verifying dose the given signature is valid
 * @param {String} address 
 * @param {Object} payload
 * @param {String} signature
 * @param {String} key
 * @param {String} accessToken
 * @returns {Object} 
 */
const verifyCardanoSignature = async ({
  address,
  payload,
  signature,
  key,
  accessToken,
}) => {
  const { data } = await axios.post(
    SERVERS.CARDANO_SERVICE + "/api/v2/verify/signature",
    {
      address: address,
      payload: payload,
      signature: signature,
      key: key,
    },
    {
      withCredentials: true,
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
    }
  );
  if (data?.code !== 0) {
    throw ERRORS.UNVERIFIED_SIGNATURE;
  }
};

export { verifyCardanoNft, verifyCardanoSignature };
