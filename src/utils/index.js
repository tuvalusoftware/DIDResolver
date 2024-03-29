import cardanoSerialization from "@emurgo/cardano-serialization-lib-nodejs";
import Ajv from "ajv";
import * as dotenv from "dotenv";
import crypto from "crypto";
import _ from "lodash";
import { env } from "../configs/constants.js";
import { ERRORS } from "../configs/errors/error.constants.js";

dotenv.config();
const companyName = env.COMPANY_NAME;
const devCompanyName = env.DEV_COMPANY_NAME;

function splitDid(did) {
    const didComponents = did.split(":");
    return {
        companyName: didComponents[2],
        fileName: didComponents[3],
    };
}

/**
 * Function used to get address from hex encoded address
 * @param {String} hexAddress - hex encoded address
 * @returns {String} - bech32 address
 */
function getAddressFromHexEncoded(hexAddress) {
    const address = cardanoSerialization.Address.from_bytes(
        Buffer.from(hexAddress, "hex")
    ).to_bech32();

    return address;
}

/**
 * Function used for getting public key from bech32 address
 * @param {String} bech32Address - bech32 address
 * @returns {String} - public key
 */
function getPublicKeyFromAddress(bech32Address) {
    const address = cardanoSerialization.Address.from_bech32(bech32Address);
    const publicKey = Buffer.from(address.to_bytes(), "hex").toString("hex");
    return publicKey;
}

/**
 * Function used for validating JSON schema
 * @param {Object} rawSchema - JSON schema
 * @param {Object} object - object to be validated
 * @returns {Object} - { valid: Boolean, detail: String }
 */
function validateJSONSchema(rawSchema, object) {
    const schema = (({ example, ...props }) => props)(rawSchema);
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(object);
    return valid ? { valid } : { valid, detail: validate.errors };
}

/**
 * Function used for checking if there is any special character in strings
 * @param {String} strings - strings to be checked
 * @returns {Object} - { valid: Boolean, string: String }
 */
function checkForSpecialChar(strings) {
    const specialChars = `\`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~`;
    for (const index in strings) {
        let result = specialChars.split("").some((specialChar) => {
            return strings[index].includes(specialChar);
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
}

/**
 * Function used for checking if two error objects are the same
 * @param {Object} obj - error object
 * @param {Object} errorObj - error object
 * @returns {Boolean} - true if two error objects are the same, false otherwise
 */
function isSameError(obj, errorObj) {
    return (
        obj.error_code === errorObj.error_code &&
        obj.error_message === errorObj.error_message
    );
}

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

/**
 * Function used for generating random string with given seed and length
 * @param {String} seed - seed to generate random string
 * @param {Number} length - length of random string
 * @returns {String} - random string
 */
function generateRandomString(seed, length) {
    const hash = crypto.createHash("sha256");
    hash.update(seed);
    const seedHash = hash.digest("hex");
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * seedHash.length);
        result += seedHash.charAt(randomIndex);
    }
    return result;
}

/**
 * Function used for spiting camel case string
 * @param {String} input - string to be split
 * @returns {String} - string after split
 */
function splitCamelCase(input) {
    return _.startCase(input).replace(/([a-z])([A-Z])/g, "$1 $2");
}

/**
 * Function used for getting DID by components
 * @param {String} didComponents - DID components
 * @returns {String} - DID {did}:{env.DEV_COMPANY_NAME}:{companyName}:{fileNameOrPublicKey
 */
function getDidByComponents(didComponents) {
    return `did:${env.DEV_COMPANY_NAME}:${didComponents}`;
}

/**
 * Function used to determine whether a particular field exists in all objects of the input array or not, making it a valuable tool for checking data consistency within an array of objects.
 * @param {Array} array - array of objects
 * @param {String} field - field to be checked
 * @returns {Boolean} - true if the field is present in all objects, false otherwise
 */
function requireFieldInArray(array, field) {
    for (const obj of array) {
        if (!obj.hasOwnProperty(field)) {
            return false; // If the field is missing in any object, return false
        }
    }
    return true; // If the field is present in all objects, return true
}

/**
 * Converts a string to a bytes32 representation.
 * @param {string} input - The input string to be converted.
 * @returns {string} The bytes32 representation of the input string.
 * @throws {Error} If the input string is longer than 32 bytes.
 */
function stringToBytes32(input) {
    // Ensure the input is not longer than 32 bytes
    if (input.length > 32) {
        throw new Error("Input string is too long for bytes32");
    }

    // Convert the string to UTF-8 bytes
    const utf8Bytes = Buffer.from(input, "utf-8");

    // Create a new Buffer (32 bytes long) filled with zeros
    const bytes32 = Buffer.alloc(32);

    // Copy the UTF-8 bytes to the Buffer
    utf8Bytes.copy(bytes32);

    return "0x" + bytes32.toString("hex");
}

/**
 * Generates a random DID (Decentralized Identifier) using a specific ID and a chosen DID method.
 * @function
 * @returns {string} The generated DID.
 */
function generateRandomDID() {
    const randomSpecificId = Math.random().toString(36).substring(2, 10);
    const did = `did:${devCompanyName}:${companyName}:${randomSpecificId}`;
    return did;
}

/**
 * Replaces an object key with a new key.
 * @param {Object} obj - The object to modify.
 * @param {string} oldKey - The key to replace.
 * @param {string} newKey - The new key to use.
 * @returns {Object} A new object with the old key removed and the new key added, or the original object if the old key doesn't exist.
 */
function replaceKey(obj, oldKey, newKey) {
    if (obj.hasOwnProperty(oldKey)) {
        // Create a new object with the old key removed and the new key added
        const newObj = { ...obj, [newKey]: obj[oldKey] };
        delete newObj[oldKey]; // Remove the old key

        return newObj;
    } else {
        // If the old key doesn't exist in the object, return the original object
        return obj;
    }
}

/**
 * Encrypts the given data using the provided security key.
 * @param {string} data - The data to be encrypted.
 * @param {string} securityKey - The security key to use for encryption.
 * @returns {string} - The encrypted data in hexadecimal format.
 */
function encryptData(data, securityKey) {
    const algorithm = "aes-256-cbc";
    const initVector = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
    let encryptedData = cipher.update(data, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
} 

/**
 * Decrypts the given data using the provided security key.
 * @param {string} data - The data to be decrypted.
 * @param {string} securityKey - The security key to use for decryption.
 * @returns {string} The decrypted data.
 */
function decryptData(data, securityKey) {
    const algorithm = "aes-256-cbc";
    const initVector = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);

    // encrypt the message
    // input encoding
    // output encoding
    let encryptedData = cipher.update(data, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    // the decipher function
    const decipher = crypto.createDecipheriv(
        algorithm,
        Securitykey,
        initVector
    );

    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

    decryptedData += decipher.final("utf8");
    return decryptedData;
}

function handlePromiseAllSettle(results, additionalErrorMessage) {
    let promiseSuccessfully = true;
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === "rejected") {
            logger.error(`Promise number ${i + 1}`);
            logger.error(result.reason);
            promiseSuccessfully = false;
        }
    }
    if (!promiseSuccessfully) {
        if (additionalErrorMessage) logger.error(additionalErrorMessage);

        throw ERRORS.PROMISE_ALL_SETTLED;
    }

    return results.map((re) => re.value);
}

export {
    decryptData,
    encryptData,
    getAddressFromHexEncoded,
    getPublicKeyFromAddress,
    validateJSONSchema,
    checkForSpecialChar,
    isSameError,
    getCurrentDateTime,
    generateRandomString,
    splitCamelCase,
    getDidByComponents,
    requireFieldInArray,
    generateRandomDID,
    replaceKey,
    stringToBytes32,
    splitDid,
    handlePromiseAllSettle,
};
