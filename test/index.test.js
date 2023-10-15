import {
    validateDIDSyntax,
    checkUndefinedVar,
    checkForSpecialChar,
    splitCamelCase,
    getDidByComponents,
    requireFieldInArray,
    validateJSONSchema,
} from "../src/utils/index.js";
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
