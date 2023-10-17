import {
    validateDIDSyntax,
    checkUndefinedVar,
    checkForSpecialChar,
    splitCamelCase,
    getDidByComponents,
    requireFieldInArray,
    validateJSONSchema,
    validateDID,
    isSameError,
    generateRandomString,
    stringToBytes32,
    generateRandomDID,
    replaceKey,
} from "../src/utils/index.js";
import chai from "chai";

let expect = chai.expect;
let should = chai.should;

const companyName = process.env.COMPANY_NAME;
const devCompanyName = process.env.DEV_COMPANY_NAME;

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
        expect(validateJSONSchema(schema, data))
            .have.property("valid")
            .equal(true);
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
        expect(validateJSONSchema(schema, data))
            .have.property("valid")
            .equal(false);
    });
});

describe("checkUndefinedVar", () => {
    it("should return true if the variable is undefined", () => {
        const undefinedVar = {
            name: undefined,
        };
        expect(checkUndefinedVar(undefinedVar))
            .have.property("undefined")
            .equal(true);
        expect(checkUndefinedVar(undefinedVar))
            .have.property("detail")
            .equal("Not found: name");
    });

    it("should return false if the variable is defined", () => {
        const definedVar = {
            name: "sample-name",
        };
        expect(checkUndefinedVar(definedVar))
            .have.property("undefined")
            .equal(false);
    });
});

describe("checkForSpecialChar", () => {
    it("should return true if the string contains a special character", () => {
        const stringWithSpecialChar = "hello@world";
        expect(checkForSpecialChar(stringWithSpecialChar))
            .have.property("valid")
            .equal(false);
    });

    it("should return false if the string does not contain a special character", () => {
        const stringWithoutSpecialChar = "helloworld";
        expect(checkForSpecialChar(stringWithoutSpecialChar))
            .have.property("valid")
            .equal(true);
    });
});

describe("splitCamelCase", () => {
    it("should split a camel case string into separate words", () => {
        const camelCaseString = "helloWorld";
        expect(splitCamelCase(camelCaseString)).equal("Hello World");
    });
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

describe("validateDID", () => {
    it("should return an object with valid: true and the correct company name and file name or public key for a valid DID", () => {
        const validDID = "did:example:example:1234";
        expect(validateDID(validDID)).to.deep.equal({
            valid: true,
            companyName: "example",
            fileNameOrPublicKey: "1234",
        });
    });

    it("should return an object with valid: false and detail: 'Undefined did.' if the input is undefined", () => {
        expect(validateDID()).to.deep.equal({
            valid: false,
            detail: "Undefined did.",
        });
    });

    it("should return an object with valid: false if the input is not a valid DID", () => {
        const invalidDID = "example:1234";
        expect(validateDID(invalidDID)).to.deep.equal({
            valid: false,
        });
    });
});

describe("isSameError", () => {
    it("should return true if the two error objects have the same error code and error message", () => {
        const errorObj1 = { error_code: 404, error_message: "Not Found" };
        const errorObj2 = { error_code: 404, error_message: "Not Found" };
        expect(isSameError(errorObj1, errorObj2)).equal(true);
    });

    it("should return false if the two error objects have different error codes", () => {
        const errorObj1 = { error_code: 404, error_message: "Not Found" };
        const errorObj2 = {
            error_code: 500,
            error_message: "Internal Server Error",
        };
        expect(isSameError(errorObj1, errorObj2)).to.be.false;
    });

    it("should return false if the two error objects have different error messages", () => {
        const errorObj1 = { error_code: 404, error_message: "Not Found" };
        const errorObj2 = { error_code: 404, error_message: "Page Not Found" };
        expect(isSameError(errorObj1, errorObj2)).to.be.false;
    });

    it("should return false if the two error objects have different error codes and error messages", () => {
        const errorObj1 = { error_code: 404, error_message: "Not Found" };
        const errorObj2 = {
            error_code: 500,
            error_message: "Internal Server Error",
        };
        expect(isSameError(errorObj1, errorObj2)).to.be.false;
    });
});

describe("generateRandomString", () => {
    it("should return a string of the specified length", () => {
        const seed = "test seed";
        const length = 10;
        const result = generateRandomString(seed, length);
        expect(result).to.be.a("string");
        expect(result).to.have.lengthOf(length);
    });

    it("should return different strings for different seeds", () => {
        const seed1 = "test seed 1";
        const seed2 = "test seed 2";
        const length = 10;
        const result1 = generateRandomString(seed1, length);
        const result2 = generateRandomString(seed2, length);
        expect(result1).to.not.equal(result2);
    });

    it("should return different strings for different lengths", () => {
        const seed = "test seed";
        const length1 = 10;
        const length2 = 20;
        const result1 = generateRandomString(seed, length1);
        const result2 = generateRandomString(seed, length2);
        expect(result1).to.not.equal(result2);
    });
});

describe("stringToBytes32", () => {
    it("should return the correct bytes32 representation for a string input", () => {
        const input = "hello world";
        const expectedOutput =
            "0x68656c6c6f20776f726c64000000000000000000000000000000000000000000";
        expect(stringToBytes32(input)).to.equal(expectedOutput);
    });

    it("should throw an error if the input string is longer than 32 bytes", () => {
        const input = "this string is longer than 32 bytes";
        expect(() => stringToBytes32(input)).to.throw(
            "Input string is too long for bytes32"
        );
    });
});

describe("generateRandomDID", () => {
    it("should return a string starting with 'did:'", () => {
        const did = generateRandomDID();
        expect(did.startsWith("did:")).to.be.true;
    });

    it("should return a string containing the devCompanyName variable", () => {
        const did = generateRandomDID();
        expect(did.includes(devCompanyName)).to.be.true;
    });

    it("should return a string containing the companyName variable", () => {
        const did = generateRandomDID();
        expect(did.includes(companyName)).to.be.true;
    });

    it("should return a string containing a specific ID", () => {
        const did = generateRandomDID();
        const specificId = did.split(":")[3];
        expect(specificId).to.have.lengthOf(8);
    });
});

describe("replaceKey", () => {
    it("should replace the old key with the new key in the object", () => {
        const obj = { a: 1, b: 2 };
        const newKey = "c";
        const oldKey = "a";
        const expected = { b: 2, c: 1 };
        expect(replaceKey(obj, oldKey, newKey)).to.deep.equal(expected);
    });

    it("should not modify the object if the old key does not exist", () => {
        const obj = { a: 1, b: 2 };
        const newKey = "c";
        const oldKey = "d";
        expect(replaceKey(obj, oldKey, newKey)).to.deep.equal(obj);
    });

    it("should not modify the object if the old key and new key are the same", () => {
        const obj = { b: 2 };
        const newKey = "a";
        const oldKey = "a";
        expect(replaceKey(obj, oldKey, newKey)).to.deep.equal(obj);
    });
});
