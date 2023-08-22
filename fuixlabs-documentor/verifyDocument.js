// * Constants libraries
import { SERVICE } from './constants/type';
import { VERIFIER_ERROR_CODE } from '../constants/error';
import { SECRET_KEY, COMPANY_NAME } from 'constants/app';

// * Rest libraries
import { CLIENT_PATH } from './rest/client.path';
import {
  requestVerifyCNFT,
  getDidDocumentByDid,
  requestVerifySignature,
  requestRetrieveSpecificDid,
} from './rest/client.rest';

// * Utilities libraries
import { digestDocument } from './utils/digest';
import { checkProof } from './utils/merkle';
import { get } from 'lodash';
import { Buffer } from 'buffer';
import { unsalt } from './utils/data';
import CryptoJS from 'crypto-js';

/**
 * Function used to validate wrapped document against current service
 * @param {Object} document - the content of wrapped document that we want to verify
 * @param {String} usedAddress - the encoded of current user's public key
 * @param {String} service - the name of service that user want to verify on
 * @return {Promise}
 */
export const verifyWrappedDocument = async (document, usedAddress, service, issuerSignedData = null) => {
  if (!document || !service || !usedAddress) {
    return VERIFIER_ERROR_CODE.INVALID_PARAMETER;
  }

  // * Distinguishing cases of verify wrapped document based on service - example: eth, cardano
  if (service !== SERVICE.CARDANO) {
    // * Coming soon
  } else {
    try {
      const res = await verifyCardanoDocument(document, usedAddress, issuerSignedData);
      return res;
    } catch (e) {
      throw e;
    }
  }
};

export const verifyPdfDocument = async({
    document
}) => {
  try {
     
  } catch (e) {
    throw e;
  }
}

/**
 * Verify the CNFT of the wrappedDocument on Cardano blockchain rely on its targetHash and policyId
 * @param {String} targetHash - targetHash of the wrappedDocument
 * @param {String} policyId - policyId of the wrappedDocument
 * @return {Promise}
 */
const verifyCNFT = async (targetHash, policyId) => {
  try {
    const response = await requestVerifyCNFT(CLIENT_PATH.VERIFY_CNFT, {
      hashOfDocument: targetHash,
      policyId: policyId,
    });
    if (!response?.data?.asset) {
      throw response;
    }
  } catch (e) {
    throw VERIFIER_ERROR_CODE.CNFTs;
  }
};

/**
 * Verify the issuer to see if the issuer is an issuer registered in the system
 * @param {string} superUserPublicKey - Public key of super user of system
 * @param {String} currentAddress - Public key of issuer who issue the document
 * @param {String} signedData - The signed data
 * @return {Promise}
 */
const verifyIssuer = async (superUserPublicKey, currentAddress, signedData) => {
  try {
    const issuerDid = await requestRetrieveSpecificDid(CLIENT_PATH.RETRIEVE_SPECIFIC_DID, {
      companyName: COMPANY_NAME,
      publicKey: currentAddress,
    });
    if(issuerDid?.data?.error_code) throw issuerDid?.data;
    
    const verifySigRes = await requestVerifySignature(CLIENT_PATH.VERIFY_SIGNATURE, {
      address: superUserPublicKey,
      payload: Buffer.from(
        JSON.stringify({
          issuerAddress: currentAddress,
        }),
        'utf8'
      ).toString('hex'),
      signature: issuerDid?.data?.content?.data?.signedData?.signature,
      key: issuerDid?.data?.content?.data?.signedData?.key,
    });
    if (!verifySigRes.data) throw verifySigRes.data;
  } catch (e) {
    throw VERIFIER_ERROR_CODE.INVALID_ISSUER;
  }
};

/**
 * Verify the signature of the wrappedDocument rely on its targetHash and policyId
 * @param {String} address
 * @param {String} payload
 * @param {String} signature
 * @return {Promise}
 */
const verifySignature = async (address, payload, signature, key) => {
  try {
    const verifySigRes = await requestVerifySignature(CLIENT_PATH.VERIFY_SIGNATURE, {
      address,
      payload,
      signature,
      key,
    });
    if (!verifySigRes.data) throw verifySigRes.data;
  } catch (e) {
    throw VERIFIER_ERROR_CODE.INVALID_SIGNATURE;
  }
};

/**
 * @param {Object} document
 * @param {String} address
 * @return {Promise}
 */

export const verifyCardanoDocument = async (document) => {
  try {
    // * First verifier is verifying the hash of wrappedDocument (targetHash)
    let verifyDocument = { ...document };
    if (verifyDocument.privacy && verifyDocument.privacy.obfuscatedData) {
      const privateFields = get(verifyDocument, 'privacy.obfuscatedData');
      let tmpDocumentData = verifyDocument?.data;
      if (privateFields.length > 0) {
        for (let i = 0; i < privateFields.length; i++) {
          let bytes = CryptoJS.AES.decrypt(privateFields[i], SECRET_KEY);
          let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8).split('}:')[0] + '}');
          let decryptedKey = bytes.toString(CryptoJS.enc.Utf8).split('}:')[1];
          tmpDocumentData = { ...tmpDocumentData, [decryptedKey]: decryptedData };
        }
        verifyDocument.data = tmpDocumentData;
      }
    }
    const res = await verifyTargetHash(verifyDocument);

    // * Go to the next step if the targetHash is valid
    if (res && !res.error_code) {
      // * Get targetHash and Signature got from wrappedDocument
      const targetHash = verifyDocument?.signature?.targetHash;
      const signature = verifyDocument?.signature?.proof[0]?.signature?.signature;
      const key = verifyDocument?.signature?.proof[0]?.signature?.key;
      const didOfWrappedDocument = verifyDocument?.data?.did;
      const policyId = verifyDocument?.mintingNFTConfig?.policy?.id;
      // * Get the public key from controller
      // * Generate payload rely on public key and targetHash
      const payload = Buffer.from(
        JSON.stringify({
          address: unsalt(verifyDocument?.data?.issuers[0]?.address),
          targetHash: targetHash,
        }),
        'utf8'
      ).toString('hex');
      // * Call to cardanoService to verify the targetHash
      await verifyCNFT(targetHash, policyId);
      await verifySignature(unsalt(verifyDocument?.data.issuers[0]?.address), payload, signature, key);
      // await verifyIssuer(
      //   process.env.REACT_APP_SUPER_USER,
      //   unsalt(verifyDocument?.data.issuers[0]?.address),
      //   issuerSignedData
      // );
      const EXCLUDE_VALUE = '';
      const getRes = await getDidDocumentByDid(CLIENT_PATH.GET_DID_DOCUMENT_BY_DID, {
        did: didOfWrappedDocument,
        exclude: EXCLUDE_VALUE,
      });
      if (getRes.data) {
        return {
          policyId: policyId,
          didDoc: getRes?.data?.didDoc || '',
        };
      }
      if (getRes.data.errorCode) throw getRes.data;
    }
    throw res;
  } catch (e) {
    throw e;
  }
};

/**
 * @param {Object} document - wrappedDocument
 * @return {Boolean}
 */
const verifyTargetHash = (document) => {
  // Get signature field from wrappedDocument which user wanna verify
  const signature = get(document, 'signature');
  if (!signature) return VERIFIER_ERROR_CODE.MISSING_SIGNATURE;
  // Checks target hash
  const digest = digestDocument(document);
  const targetHash = get(document, 'signature.targetHash');

  // If the system hashes the contents of the current wrapperDocument, check if it matches the targetHash available in the wrapperDocument.
  if (digest !== targetHash) return VERIFIER_ERROR_CODE.INVALID_TARGET_HASH;

  // Function that runs through the supplied hashes to arrive at the supplied merkle root hash
  return checkProof([], document?.signature?.merkleRoot, document?.signature?.targetHash);
};
