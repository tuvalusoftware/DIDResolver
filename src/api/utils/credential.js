// * Utilities
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import axios from "axios";
import { getCredential } from "../utils/controller.js";
import { sha256 } from "js-sha256";

// * Constants
import { SERVERS } from "../../config/constants.js";

/**
 * Create credential to authenticate the exchange of document ownership between the owner and the holders
 * @param {String} issuerDid
 * @param {String} holderDid
 * @param {String} didoWrappedDocument
 * @param {Object} metadata
 * @param {Object} action - purpose of creating credential
 * @param {String} signature
 * @return {Object} - return a credential
 */
const createVerifiableCredential = async ({
  signData,
  issuerKey,
  subject,
  credentialDid,
}) => {
  try {
    const credential = {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://www.w3.org/ns/credentials/examples/v2",
      ],
      id: credentialDid,
      type: ["VerifiableCredential"],
      issuer: generateDid(process.env.COMPANY_NAME, issuerKey),
      validFrom: new Date().toISOString(),
      credentialSubject: [subject],
      proof: {
        signData,
      },
    };
    return { credential };
  } catch (e) {
    throw e;
  }
};

/**
 * Function used to verify credential
 * @param {String} hash - Hash of the credential
 * @param {String} policyId - Policy ID of the credential
 * @param {String} accessToken - Access token of the user
 * @returns {Promise<Boolean>} - Return true if credential is verified, false otherwise
 */
const verifyCredential = async ({ hash, policyId, accessToken }) => {
  try {
    let query = { policyId: policyId },
      undefinedCheck = { policyId };
    if (hash) {
      query = { asset: `${policyId}${hash}` };
      undefinedCheck = { ...undefinedCheck, hash };
    }
    const nftResponse = await axios.post(
      `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
      query,
      {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${accessToken}`,
        },
      }
    );
    if (nftResponse?.data?.code !== 0) {
      throw new Error("Cannot fetch NFT");
    }
    return true;
  } catch (e) {
    throw e;
  }
};

/**
 *
 * @param {Object} credential - Credential object got from the response of createVerifiableCredential function
 * @param {String} accessToken - Access token of the user
 * @returns {Object<credential>} - Return a credential object
 */
const getAndVerifyCredential = async ({ credential, accessToken }) => {
  return new Promise(async (resolve, reject) => {
    const credentialResponse = await getCredential({
      accessToken: accessToken,
      hash: credential,
    });
    const policyId = credentialResponse?.data?.mintingNFTConfig?.policy?.id;
    const variableResponse = await verifyCredential({
      hash: credential,
      policyId: policyId,
      accessToken: accessToken,
    });
    if (variableResponse?.error_code) {
      reject(variableResponse?.data);
    }
    let _credential = {
      ...credentialResponse?.data,
    };
    delete _credential.mintingNFTConfig;
    const deployedCredentialHash = sha256(
      Buffer.from(JSON.stringify(_credential), "utf8").toString("hex")
    );
    if (credential !== deployedCredentialHash) {
      reject("Credential is not verified");
    }
    resolve(credentialResponse?.data);
  });
};

export { createVerifiableCredential, verifyCredential, getAndVerifyCredential };
