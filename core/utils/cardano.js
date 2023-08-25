// * Utilities
import axios from "axios";

// * Constants
import { SERVERS, ERRORS } from "../constants.js";

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
  if (data?.code !== 0) {
    throw ERRORS.CANNOT_FETCH_NFT;
  }
};

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
