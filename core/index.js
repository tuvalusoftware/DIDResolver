import cardanoSerialization from "@emurgo/cardano-serialization-lib-nodejs";
import Ajv from "ajv";
import Logger from "../logger.js";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Function used for validating DID syntax
 * @param {String} did - DID to be validated
 * @param {*} isSalted - true if did is salted, false otherwise
 * @returns {Object} - { valid: Boolean, detail: String }
 */
const validateDIDSyntax = (did, isSalted) => {
  if (!did) {
    Logger.error("Undefined did.");
    return { valid: false, detail: "Undefined did." };
  }
  const maxLength = isSalted ? 6 : 4;
  const didPosition = isSalted ? 2 : 0;
  const didComponents = did.split(":");

  if (
    didComponents.length < maxLength ||
    didComponents[didPosition] !== "did"
  ) {
    Logger.error(
      `Invalid DID syntax. Given did = ${did} should be ${
        isSalted ? "salted" : "unsalted"
      }.`
    );
    return { valid: false };
  }
  Logger.info("Valid did.");
  return {
    valid: true,
    companyName: didComponents[didPosition + 2],
    fileNameOrPublicKey: didComponents[didPosition + 3],
  };
};

/**
 * Function used to get address from hex encoded address
 * @param {String} hexAddress - hex encoded address
 * @returns {String} - bech32 address
 */
const getAddressFromHexEncoded = (hexAddress) => {
  const address = cardanoSerialization.Address.from_bytes(
    Buffer.from(hexAddress, "hex")
  ).to_bech32();

  Logger.info(`Address from hex (${hexAddress}) = ${address}`);
  return address;
};

/**
 * Function used for getting public key from bech32 address
 * @param {String} bech32Address - bech32 address
 * @returns {String} - public key
 */
const getPublicKeyFromAddress = (bech32Address) => {
  const address = cardanoSerialization.Address.from_bech32(bech32Address);
  const publicKey = Buffer.from(address.to_bytes(), "hex").toString("hex");
  Logger.info(`Publickey from address ${bech32Address} is ${publicKey}`);
  return publicKey;
};

/**
 * Function used for validating JSON schema
 * @param {Object} rawSchema - JSON schema
 * @param {Object} object - object to be validated
 * @returns {Object} - { valid: Boolean, detail: String }
 */
const validateJSONSchema = (rawSchema, object) => {
  const schema = (({ example, ...props }) => props)(rawSchema);
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(object);
  if (!valid)
    Logger.error(`Invalid object.\n${JSON.stringify(validate.errors)}`);
  return valid ? { valid } : { valid, detail: validate.errors };
};

/**
 * Function used for checking if there is any undefined variable in JSON object
 * @param {Object} object - JSON object
 * @returns {Object} - { undefined: Boolean, detail: String }
 */
const checkUndefinedVar = (object) => {
  let detail = "Not found:",
    flag = false;
  for (const [key, value] of Object.entries(object)) {
    if (value === undefined) {
      detail += " " + key;
      flag = true;
    }
  }
  if (flag) Logger.error(`${detail}`);
  else Logger.info(`Valid JSON object.`);
  return flag ? { undefined: true, detail } : { undefined: false };
};

/**
 * Function used for checking if there is any special character in strings
 * @param {String} strings - strings to be checked
 * @returns {Object} - { valid: Boolean, string: String }
 */
const checkForSpecialChar = (strings) => {
  const specialChars = `\`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~`;
  for (const index in strings) {
    let result = specialChars.split("").some((specialChar) => {
      if (strings[index].includes(specialChar)) {
        return true;
      }
      return false;
    });
    if (result) {
      return {
        valid: false,
        string: index,
      };
    }
  }
  return {
    valid: true,
  };
};

/**
 * Function used for checking if two error objects are the same
 * @param {Object} obj - error object
 * @param {Object} errorObj - error object
 * @returns {Boolean} - true if two error objects are the same, false otherwise
 */
const isSameError = (obj, errorObj) => {
  return obj.error_code === errorObj.error_code &&
    obj.error_message === errorObj.error_message
    ? true
    : false;
};

/**
 * Function used for getting current date time
 * @returns {String} - current date time
 */
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}

export {
  validateDIDSyntax,
  getAddressFromHexEncoded,
  getPublicKeyFromAddress,
  validateJSONSchema,
  checkUndefinedVar,
  checkForSpecialChar,
  isSameError,
  getCurrentDateTime,
};
