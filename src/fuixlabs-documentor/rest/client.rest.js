import axiosClient from './client.base.js';
import axios from 'axios';
const BASE_URL = '';

export const sendWrappedDocument = async (path, data) => {
  return await axios.post(`${BASE_URL}${path}`, data);
};

/**
 * Call cardano service for verifying CNFT
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestVerifyCNFT = async (path, data) => {
  const { hashOfDocument, policyId } = data;
  return await axiosClient.get(`${BASE_URL}${path}`, {
    headers: {
      hashOfDocument,
      policyId,
    },
  });
};

/**
 * Call cardano service for verifying signature rely on targetHash and public-key
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestVerifySignature = async (path, data) => {
  const { address, payload, signature, key } = data;
  return await axiosClient.get(`${BASE_URL}${path}`, {
    headers: {
      address,
      payload,
      signature,
      key,
    },
  });
};

/**
 * Check the exists of did's wrapped document through url resolver
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const checkExistsDidoWrappedDoc = async (path, data) => {
  return await axiosClient.get(`${BASE_URL}${path}`, { headers: data });
};

/**
 * Get did-document by did of wrapped-document
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */

export const getDidDocumentByDid = async (path, data) => {
  const { did, exclude } = data;
  // * only parameter to represent when you need to get a specific object from the DIDController side
  const queryParams = `?only=${exclude}`;
  return await axiosClient.get(`${BASE_URL}${path}${queryParams}`, {
    headers: {
      did: did,
    },
  });
};

/**
 * Get list of nfts from cardano service by policy-id
 * @param {String} path
 * @param {Object} data - example: {policyId: 'xxxx'}
 * @return {Promise}
 */
export const _pullNFTs = async (path, data) => {
  const { policyId } = data;
  return await axiosClient.get(`${BASE_URL}${path}`, {
    headers: {
      policyId: policyId,
    },
  });
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestPullTransactions = async (path, data) => {
  return await axiosClient.get(`${BASE_URL}${path}`, {
    headers: data,
  });
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestCreateCredential = async (path, data) => {
  return await axiosClient.post(`${BASE_URL}${path}`, data);
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestPublicKey = async (path, data) => {
  const { address, user, confirmNominate } = data;
  return await axiosClient.get(
    `${BASE_URL}${path}?address=${address}&&user=${user}&&confirmNominate=${confirmNominate}`
  );
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestUpdateDidDocument = async (path, data) => {
  return await axiosClient.put(`${BASE_URL}${path}`, data);
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestRevokeDocument = async (path, data) => {
  return await axiosClient.delete(`${BASE_URL}${path}`, data);
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestRetrieveDid = async (path, data) => {
  return await axiosClient.get(`${BASE_URL}${path}?companyName=${data.companyName}`);
};

/**
 * Retrieve specific did with given publicKey and companyName
 *
 */
export const requestRetrieveSpecificDid = async (path, data) => {
  return await axiosClient.get(`${BASE_URL}${path}?companyName=${data.companyName}&publicKey=${data.publicKey}`);
};

/**
 *
 */
export const requestUpdateDid = async (path, data) => {
  return await axiosClient.put(`${BASE_URL}${path}`, data);
};

/**
 *
 */
export const requestCreateUserDid = async (path, data) => {
  return await axiosClient.post(`${BASE_URL}${path}`, data);
};

/**
 *
 */
export const requestDeleteUserDid = async (path, data) => {
  return await axiosClient.delete(`${BASE_URL}${path}`, { data: data });
};
