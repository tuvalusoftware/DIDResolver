import lodashPkg from "lodash";
import sha3Pkg from "js-sha3";
import { _flatten } from "./flatten.js";

const { get, omitBy, sortBy } = lodashPkg;
const { keccak256 } = sha3Pkg;

const isKeyOrValueUndefined = (value, key) =>
  value === undefined || key === undefined;

const flattenHashArray = (data) => {
  const flattenedData = omitBy(_flatten(data), isKeyOrValueUndefined);
  return Object.keys(flattenedData).map((k) => {
    const obj = {};
    obj[k] = flattenedData[k];
    return keccak256(JSON.stringify(obj));
  });
};

/**
 * @param {Object} document
 * @return {String}
 */
export const digestDocument = (document) => {
  // Prepare array of hashes from filtered data
  const hashedDataArray = [];

  // Prepare array of hashes from visible data
  const unhashedData = get(document, "data");
  const hashedUnhashedDataArray = flattenHashArray(unhashedData);

  // Combine both array and sort them to ensure determinism
  const combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};
