import {
    validateDIDSyntax,
    getAddressFromHexEncoded,
    getPublicKeyFromAddress,
    validateJSONSchema,
    checkUndefinedVar,
    checkForSpecialChar,
    isSameError,
    getCurrentDateTime,
    generateQRCode,
    generateRandomString,
    splitCamelCase,
    validateDID,
    getDidByComponents,
    requireFieldInArray,
    encrypt,
    decrypt,
    generateRandomDID,
} from "../src/api/utils/index.js";
import chai from "chai";

let expect = chai.expect;
let should = chai.should;

describe("validateDIDSyntax", () => {
    it("should return true for a valid DID", () => {
        const validDID = "did:example:example:1234";
        expect(JSON.stringify(validateDIDSyntax(validDID))).equal(
            JSON.stringify({
                valid: true,
                companyName: "example",
                fileNameOrPublicKey: "1234",
            })
        );
    });

    it("should return false for an invalid DID", () => {
        const invalidDID = "example:1234";
        expect(validateDIDSyntax(invalidDID).valid).equal(false);
    });
});

describe("getAddressFromHexEncoded", () => {
    it("should return the correct address for a valid hex-encoded string", () => {
        const hexString = "0x1234567890abcdef";
        expect(getAddressFromHexEncoded(hexString)).equal("0x1234567890abcdef");
    });

    it("should throw an error for an invalid hex-encoded string", () => {
        const invalidHexString = "0x1234567890abcdeg";
        expect(() => getAddressFromHexEncoded(invalidHexString)).toThrow();
    });
});

describe("getPublicKeyFromAddress", () => {
    it("should return the correct public key for a valid address", () => {
        const address = "0x1234567890abcdef";
        expect(getPublicKeyFromAddress(address)).equal("0xabcdef1234567890");
    });

    it("should throw an error for an invalid address", () => {
        const invalidAddress = "0x1234567890abcdeg";
        expect(() => getPublicKeyFromAddress(invalidAddress)).toThrow();
    });
});

describe("validateJSONSchema", () => {
    it("should return true for a valid JSON schema", () => {
        const schema = {
            type: "object",
            properties: {
                name: { type: "string" },
                age: { type: "number" },
            },
            required: ["name", "age"],
        };
        const data = { name: "John", age: 30 };
        expect(validateJSONSchema(schema, data)).equal(true);
    });

    it("should return false for an invalid JSON schema", () => {
        const schema = {
            type: "object",
            properties: {
                name: { type: "string" },
                age: { type: "number" },
            },
            required: ["name", "age"],
        };
        const data = { name: "John" };
        expect(validateJSONSchema(schema, data)).equal(false);
    });
});

describe("checkUndefinedVar", () => {
    it("should return true if the variable is undefined", () => {
        const undefinedVar = undefined;
        expect(checkUndefinedVar(undefinedVar)).equal(true);
    });

    it("should return false if the variable is defined", () => {
        const definedVar = "defined";
        expect(checkUndefinedVar(definedVar)).equal(false);
    });
});

describe("checkForSpecialChar", () => {
    it("should return true if the string contains a special character", () => {
        const stringWithSpecialChar = "hello@world";
        expect(checkForSpecialChar(stringWithSpecialChar)).equal(true);
    });

    it("should return false if the string does not contain a special character", () => {
        const stringWithoutSpecialChar = "helloworld";
        expect(checkForSpecialChar(stringWithoutSpecialChar)).equal(false);
    });
});

describe("isSameError", () => {
    it("should return true if the two errors have the same message", () => {
        const error1 = new Error("Error message");
        const error2 = new Error("Error message");
        expect(isSameError(error1, error2)).equal(true);
    });

    it("should return false if the two errors have different messages", () => {
        const error1 = new Error("Error message 1");
        const error2 = new Error("Error message 2");
        expect(isSameError(error1, error2)).equal(false);
    });
});

describe("getCurrentDateTime", () => {
    it("should return the current date and time in ISO format", () => {
        const currentDateTime = getCurrentDateTime();
        expect(currentDateTime).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        );
    });
});

describe("generateQRCode", () => {
    // TODO: Write tests for generateQRCode
});

describe("generateRandomString", () => {
    // TODO: Write tests for generateRandomString
});

describe("splitCamelCase", () => {
    it("should split a camel case string into separate words", () => {
        const camelCaseString = "helloWorld";
        expect(splitCamelCase(camelCaseString)).equal("Hello World");
    });
});

describe("validateDID", () => {
    // TODO: Write tests for validateDID
});

describe("getDidByComponents", () => {
    it("should return a valid DID string", () => {
        const didComponents = "example:1234";
        const expectedDID = `did:${process.env.DEV_COMPANY_NAME}:${didComponents}`;
        expect(getDidByComponents(didComponents)).equal(expectedDID);
    });
});

describe("requireFieldInArray", () => {
    it("should return true if the field is present in all objects in the array", () => {
        const array = [{ name: "John" }, { name: "Jane" }];
        const field = "name";
        expect(requireFieldInArray(array, field)).equal(true);
    });

    it("should return false if the field is missing in any object in the array", () => {
        const array = [{ name: "John" }, { age: 30 }];
        const field = "name";
        expect(requireFieldInArray(array, field)).equal(false);
    });
});

describe("encrypt", () => {
    // TODO: Write tests for encrypt
});

describe("decrypt", () => {
    // TODO: Write tests for decrypt
});

describe("generateRandomDID", () => {
    // TODO: Write tests for generateRandomDID
});
