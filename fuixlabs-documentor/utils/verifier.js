import pkg from 'lodash';
import { VERIFIER_ERROR_CODE } from '../constants/error.js';
import { digestDocument } from './digest.js';
import { checkProof } from './merkle.js';
import { requestVerifyCNFT, requestVerifySignature, getDidDocumentByDid } from '../rest/client.rest.js';
import { CLIENT_PATH } from '../rest/client.path.js';
import { Buffer } from 'buffer';

const {get} = pkg;

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
    if (response.data.error_code || !response.data.data.result) {
      throw response.data;
    }
  } catch (e) {
    throw VERIFIER_ERROR_CODE.CNFTs;
  }
};

/**
 * Verify the signature of the wrappedDocument rely on its targetHash and policyId
 * @param {String} address
 * @param {String} payload
 * @param {String} signature
 * @return {Promise}
 */
const verifySignature = async (address, payload, signature) => {
  try {
    const verifySigRes = await requestVerifySignature(CLIENT_PATH.VERIFY_SIGNATURE, { address, payload, signature });
    if (verifySigRes.data.error_code || !verifySigRes.data.data.result) throw verifySigRes.data;
  } catch (e) {
    throw VERIFIER_ERROR_CODE.INVALID_SIGNATURE;
  }
};

/**
 * @param {Object} document
 * @param {String} address
 * @return {Promise}
 */

export const verifyCardanoDocument = async (document, address) => {
  try {
    // First verifier is verifying the hash of wrappedDocument (targetHash)
    const res = await verifyTargetHash(document);
    // Go to the next step if the targetHash is valid
    if (res && !res.error_code) {
      // Get targetHash and Signature got from wrappedDocument
      const targetHash = document?.signature?.targetHash;
      const signature = document?.signature?.proof[0]?.signature;
      const didOfWrappedDocument = document?.data?.did;
      const policyId = document?.policyId;
      // Get the public key from controller
      // Generate payload rely on public key and targetHash
      const payload = Buffer.from(
        JSON.stringify({
          address: address,
          targetHash: targetHash,
        }),
        'utf8'
      ).toString('hex');
      // Call to cardanoService to verify the targetHash
      await verifyCNFT(targetHash, policyId);
      await verifySignature(address, payload, signature);
      const EXCLUDE_VALUE = '';
      const getRes = await getDidDocumentByDid(CLIENT_PATH.GET_DID_DOCUMENT_BY_DID, {
        did: didOfWrappedDocument,
        exclude: EXCLUDE_VALUE,
      });
      if (getRes.data) {
        return {
          policyId: policyId,
          didDoc: getRes.data.didDoc,
        };
      }
      if (getRes.data.errorCode) throw getRes.data;
    }
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
