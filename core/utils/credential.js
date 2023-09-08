// * Utilities
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import axios from "axios";
import logger from "../../logger.js";
import { getCredential } from "../../core/utils/controller.js";
import { sha256 } from "js-sha256";

// * Constants
import { SERVERS } from "../../core/constants.js";

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
const createVerifiableCredential = async (
  { didoWrappedDocument, metadata, action },
  currentUserPublicKey,
  lucidClient,
  currentWallet
) => {
  const credentialSubject = {
    object: didoWrappedDocument,
    action: action,
  };
  const payload = {
    address: currentUserPublicKey,
    subject: credentialSubject,
  };
  try {
    const signMessage = await lucidClient
      ?.newMessage(
        currentWallet?.paymentAddr,
        Buffer.from(JSON.stringify(payload), "utf8").toString("hex")
      )
      .sign();
    const hexStringPayload = Buffer.from(
      JSON.stringify(payload),
      "utf8"
    ).toString("hex");
    const signedData = signMessage;
    let credential = {
      issuer: generateDid(process.env.COMPANY_NAME, currentUserPublicKey),
      credentialSubject,
      signature: signedData,
      metadata,
    };
    return { credential, payload: hexStringPayload, signature: signedData };
  } catch (e) {
    throw e;
  }
};

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
