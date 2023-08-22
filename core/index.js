import cardanoSerialization from "@emurgo/cardano-serialization-lib-nodejs";
import Ajv from "ajv";
import Logger from "../logger.js";
import * as dotenv from "dotenv";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
const fsPromises = fs.promises;

dotenv.config();

const validateDIDSyntax = (did, isSalted) => {
  // DID syntax = did:method:companyName:fileNameOrPublicKey
  // Salted DID = uuid:string:did:method:companyName:fileNameOrPublicKey
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

const getAddressFromHexEncoded = (hexAddress) => {
  const address = cardanoSerialization.Address.from_bytes(
    Buffer.from(hexAddress, "hex")
  ).to_bech32();

  Logger.info(`Address from hex (${hexAddress}) = ${address}`);
  return address;
};

const getPublicKeyFromAddress = (bech32Address) => {
  const address = cardanoSerialization.Address.from_bech32(bech32Address);
  const publicKey = Buffer.from(address.to_bytes(), "hex").toString("hex");
  Logger.info(`Publickey from address ${bech32Address} is ${publicKey}`);
  return publicKey;
};

const validateJSONSchema = (rawSchema, object) => {
  const schema = (({ example, ...props }) => props)(rawSchema);

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  const valid = validate(object);
  if (!valid)
    Logger.error(`Invalid object.\n${JSON.stringify(validate.errors)}`);
  return valid ? { valid } : { valid, detail: validate.errors };
};

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

async function createPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 200]);
  page.drawText("Hello, PDF!", {
    x: 50,
    y: 150,
    size: 30,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  await fsPromises.writeFile("./assets/pdf/pdfSample.pdf", pdfBytes);
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
  createPDF,
};
