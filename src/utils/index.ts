import Ajv from "ajv";
import * as dotenv from "dotenv";
import crypto from "crypto";
import QRCode from "qrcode";
import { Buffer } from "buffer";
import _ from "lodash";
import { ErrorResponse } from "../configs/types";
import cardanoSerialization, {
    Address,
} from "@emurgo/cardano-serialization-lib-nodejs";

dotenv.config();
const companyName = process.env.COMPANY_NAME;
const devCompanyName = process.env.DEV_COMPANY_NAME;

/**
 * Function used for validating DID syntax
 * @param {String} did - DID to be validated
 * @param {*} isSalted - true if did is salted, false otherwise
 * @returns {Object} - { valid: Boolean, detail: String }
 */
const validateDIDSyntax = (did: string, isSalted: Boolean): Object => {
    if (!did) {
        return { valid: false, detail: "Undefined did." };
    }
    const maxLength = isSalted ? 6 : 4;
    const didPosition = isSalted ? 2 : 0;
    const didComponents = did.split(":");

    if (
        didComponents.length < maxLength ||
        didComponents[didPosition] !== "did"
    ) {
        return { valid: false };
    }
    return {
        valid: true,
        companyName: didComponents[didPosition + 2],
        fileNameOrPublicKey: didComponents[didPosition + 3],
    };
};

/**
 * Function used for validating DID syntax
 * @param {String} did - DID to be validated
 * @returns {Object} - { valid: Boolean, detail: String }
 */
const validateDID = (did: string): Object => {
    if (!did) {
        return { valid: false, detail: "Undefined did." };
    }
    const didComponents = did.split(":");

    if (didComponents.length < 4 || didComponents[0] !== "did") {
        return { valid: false };
    }
    return {
        valid: true,
        companyName: didComponents[2],
        fileNameOrPublicKey: didComponents[3],
    };
};

/**
 * Function used to get address from hex encoded address
 * @param {String} hexAddress - hex encoded address
 * @returns {String} - bech32 address
 */
const getAddressFromHexEncoded = (hexAddress: string): string => {
    const address = cardanoSerialization.Address.from_bytes(
        Buffer.from(hexAddress, "hex")
    ).to_bech32();

    return address;
};

/**
 * Function used for getting public key from bech32 address
 * @param {String} bech32Address - bech32 address
 * @returns {String} - public key
 */
const getPublicKeyFromAddress = (bech32Address: string): string => {
    const address = Address.from_bech32(bech32Address);
    const publicKey = Buffer.from(address.to_bytes()).toString("hex");
    return publicKey;
};

/**
 * Function used for validating JSON schema
 * @param {Object} rawSchema - JSON schema
 * @param {Object} object - object to be validated
 * @returns {Object} - { valid: Boolean, detail: String }
 */
const validateJSONSchema = (rawSchema: object, object: object): object => {
    const schema = (({ example, ...props }) => props)(rawSchema);
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(object);
    return valid ? { valid } : { valid, detail: validate.errors };
};

/**
 * Function used for checking if there is any undefined variable in JSON object
 * @param {Object} object - JSON object
 * @returns {Object} - { undefined: Boolean, detail: String }
 */
const checkUndefinedVar = (
    object: object
): {
    undefined: Boolean;
    detail?: String;
} => {
    let detail = "Not found:",
        flag = false;
    for (const [key, value] of Object.entries(object)) {
        if (value === undefined) {
            detail += " " + key;
            flag = true;
        }
    }
    return flag ? { undefined: true, detail } : { undefined: false };
};

/**
 * Function used for checking if there is any special character in strings
 * @param {String} strings - strings to be checked
 * @returns {Object} - { valid: Boolean, string: String }
 */
const checkForSpecialChar = (
    strings: string[]
): {
    valid: Boolean;
    string?: String;
} => {
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
const isSameError = (obj: ErrorResponse, errorObj: ErrorResponse): Boolean => {
    return obj.error_code === errorObj.error_code &&
        obj.error_message === errorObj.error_message
        ? true
        : false;
};

/**
 * Function used for getting current date time
 * @returns {String} - current date time
 */
const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}; // TODO - Write unit-test

/**
 * Function used for generating random string with given seed and length
 * @param {String} seed - seed to generate random string
 * @param {Number} length - length of random string
 * @returns {String} - random string
 */
const generateRandomString = (seed: string, length: number): string => {
    const hash = crypto.createHash("sha256");
    hash.update(seed);
    const seedHash = hash.digest("hex");
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * seedHash.length);
        result += seedHash.charAt(randomIndex);
    }
    return result;
};

/**
 * Function used for spiting camel case string
 * @param {String} input - string to be split
 * @returns {String} - string after split
 */
const splitCamelCase = (input: string): string => {
    return _.startCase(input).replace(/([a-z])([A-Z])/g, "$1 $2");
};

/**
 * Function used for getting DID by components
 * @param {String} didComponents - DID components
 * @returns {String} - DID {did}:{process.env.DEV_COMPANY_NAME}:{companyName}:{fileNameOrPublicKey
 */
const getDidByComponents = (didComponents: string): string => {
    return `did:${process.env.DEV_COMPANY_NAME}:${didComponents}`;
};

/**
 * Function used to determine whether a particular field exists in all objects of the input array or not, making it a valuable tool for checking data consistency within an array of objects.
 * @param {Array} array - array of objects
 * @param {String} field - field to be checked
 * @returns {Boolean} - true if the field is present in all objects, false otherwise
 */
const requireFieldInArray = (array: Object[], field: string): Boolean => {
    for (const obj of array) {
        if (!obj.hasOwnProperty(field)) {
            return false; // If the field is missing in any object, return false
        }
    }
    return true; // If the field is present in all objects, return true
};

/**
 * Converts a string to a bytes32 representation.
 * @param {string} input - The input string to be converted.
 * @returns {string} The bytes32 representation of the input string.
 * @throws {Error} If the input string is longer than 32 bytes.
 */
const stringToBytes32 = (input: string): string => {
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
};

/**
 * Generates a random DID (Decentralized Identifier) using a specific ID and a chosen DID method.
 * @function
 * @returns {string} The generated DID.
 */
const generateRandomDID = (): string => {
    // Generate a random specific ID (for example, using Math.random())
    const randomSpecificId = Math.random().toString(36).substring(2, 10);

    // Choose a DID method (you can replace this with your desired method)
    const didMethod = "example";

    // Combine the method and specific ID to create the DID
    const did = `did:${devCompanyName}:${companyName}:${randomSpecificId}`;

    return did;
};

/**
 * Replaces an object key with a new key.
 * @param {Object} obj - The object to modify.
 * @param {string} oldKey - The key to replace.
 * @param {string} newKey - The new key to use.
 * @returns {Object} A new object with the old key removed and the new key added, or the original object if the old key doesn't exist.
 */
const replaceKey = (obj: Object, oldKey: string, newKey: string): Object => {
    if (obj.hasOwnProperty(oldKey)) {
        // Create a new object with the old key removed and the new key added
        const newObj = { ...obj, [newKey]: obj[oldKey] };
        delete newObj[oldKey]; // Remove the old key

        return newObj;
    } else {
        // If the old key doesn't exist in the object, return the original object
        return obj;
    }
};
