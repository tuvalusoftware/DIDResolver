// * Utilities
dotenv.config();
import * as dotenv from "dotenv";
import htmlPDF from "puppeteer-html-pdf";
import { PDFDocument } from "pdf-lib";
import crypto from "node:crypto";
import fs from "fs";
import axios from "axios";
import { getDocumentContentByDid } from "./controller.js";
import { authenticationProgress } from "./auth.js";
import { verifyWrappedDocument } from "../../fuixlabs-documentor/verifyDocument.js";

/**
 * Function used for creating pdf file
 * @param {String} fileName - name of file
 * @returns {Promise} - Promise of pdf file
 */
const createPdf = async ({ fileName, data }) => {
  const options = {
    format: "A4",
    path: `./assets/pdf/${fileName}.pdf`, // you can pass path to save the file
  };

  const content = `<div style="
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  width: 1400px;
  font-family: Roboto, sans-serif
">
    <div
      style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 20px;">
      <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
        <img src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692850294707_commonlands.svg"
          alt="commonlands" style="height: 100%; width: 100px; margin-right: 30px;" />
        <div style="display: flex; flex-direction: column; margin-left: 20px;">
          <span style="font-size: 24px; font-weight: bold; line-height: 40px;">Commonlands Certificate</span>
          <span style="font-size: 15px; line-height: 40px;">No. ${data?.No}</span>
          <span style="font-size: 15px; line-height: 40px;">Date Issued: ${data?.dateIssue}</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end;">
        <!-- QRCode here -->
        <p style="color: rgba(0, 0, 0, 0.50); font-size: 14px; font-weight: 400;">Scan the QR code to verify the
          authenticity of this Certificate</p>
      </div>
    </div>
    <div style="border-top: 1px solid black; margin-top: 30px; padding: 0px;">
      <div style="display: flex; flex-direction: row; padding: 10px">
        <img src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692850770797_sampleImage.png"
          alt="profile" style="height: 150px; width: 120px;" />
        <div style="padding: 15px;">
          <div style="display: flex; flex-direction: row;">
            <p>Claimant: <b>${data?.personalInformation?.claimant}</b></p>
            <div style="display: flex; flex-direction: row; align-items: center; margin-left: 100px;">
              <p>Right to Claim: </p>
              <div
                style="border-radius: 21px; background: #3A97AD; color: #FFF; font-weight: bold; font-size: 12px; padding: 10px; margin-left: 10px;">
                ${data?.personalInformation?.right}</div>
            </div>
          </div>
          <p style="margin: 10px 0px;">Phone Number: <b>${data?.personalInformation?.phoneNumber}</b></p>
          <div style="display: flex; flex-direction: row; align-items: center;">
            <p>Claimrank:</p>
            <div
              style="margin-left: 10px; background-color: #3EBF84; border-radius: 21px; padding: 10px 15px; font-size: 12px; font-weight: bold; color: #FFF;">
              ${data?.personalInformation?.claimrank}</div>
          </div>
          <p style="margin-top: 10px; font-weight: bold;">${data?.personalInformation?.description}</p>
        </div>
      </div>
      <!-- More content here -->
    </div>
    <div style="border-top: 1px solid black; padding: 20px; ">
      <div style="display: flex;">
        <p>Plot Name: </p>
        <p style="font-weight: bold;">${data?.plotInformation?.plotName}</p>
      </div>
    </div>
    <div style="border-top: 1px solid black; padding: 20px; ">
      <div style="grid-column: 3;">
        <p>Plot ID</p>
      </div>
      <div style="grid-column: 3; font-weight: bold;">
        ${data?.plotInformation?.plotId}
      </div>
    </div>
    <div style="border-top: 1px solid black; padding: 20px; ">
      <div style="grid-column: 3;">
        <p>Plot Status</p>
      </div>
      <div style="grid-column: 9;">
        <p style="margin-bottom: 10px;">
          This plot has been granted an official Commonlands Certificate and is in good standing. Owners are free to
          utilize the plot for securing contracts if desired and have the ability to sell or trade it.
        </p>
        <div style="border-radius: 28px; background: #5EC4AC; width: fit-content; padding: 10px 15px;">
          <p style="font-weight: bold; color: #FFF; font-size: 12px;">
            ${data?.plotInformation?.plotStatus}
          </p>
        </div>
      </div>
    </div>
    <div style="border-top: 1px solid black; border-bottom: 1px solid black; padding: 20px; ">
      <div style="grid-column: 3;">
        <p>Plot Location</p>
      </div>
      <div style="grid-column: 3; font-weight: bold;">
        ${data?.plotInformation?.plotLocation}
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding: 20px">
      <div style="">
        <div>
          <p style="font-weight: bold;">Certificate by Commonlands</p>
          <div style="display: flex; flex-direction: row; align-items: center;">
            <p>Public Signature</p>
            <div
              style="border-bottom: 1px solid black; margin-left: 20px; display: flex; flex-direction: row; align-items: center;">
              <img
                src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692850451282_commonlands-signature.svg"
                style="height: 40px; width: 80px;" alt="commonlands-signature" />
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
          <p>Name</p>
          <div
            style="border-bottom: 1px solid black; margin-left: 20px; display: flex; flex-direction: row; align-items: center;">
            <p>${data?.certificateByCommonlands?.name}</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
          <p>Commission Number</p>
          <div
            style="border-bottom: 1px solid black; margin-left: 20px; display: flex; flex-direction: row; align-items: center;">
            <p>${data?.certificateByCommonlands?.commissionNumber}</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
          <p>Commission Expires</p>
          <div
            style="border-bottom: 1px solid black; margin-left: 20px; display: flex; flex-direction: row; align-items: center;">
            <p>${data?.certificateByCommonlands?.commissionExpiries}</p>
          </div>
        </div>
      </div>
      <div style="">
        <div>
          <p style="font-weight: bold;">Certificate by Commonlands</p>
          <div style="display: flex; flex-direction: row; align-items: center;">
            <p>Public Signature</p>
            <div
              style="border-bottom: 1px solid black; margin-left: 20px; display: flex; flex-direction: row; align-items: center;">
              <img
                src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692850378560_darius-signature.svg"
                style="height: 40px; width: 80px;" alt="commonlands-signature" />
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
          <p>Name</p>
          <div
            style="border-bottom: 1px solid black; margin-left: 20px; display: flex; flex-direction: row; align-items: center;">
            <p>${data?.certificateByCEO?.name}</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
          <p>Commission Number</p>
          <div
            style="border-bottom: 1px solid black; margin-left: 20px; display: flex; flex-direction: row; align-items: center;">
            <p>${data?.certificateByCEO?.commissionNumber}</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
          <p>Commission Expires</p>
          <div
            style="border-bottom: 1px solid black; margin-left: 20px; display: flex; flex-direction: row; align-items: center;">
            <p>${data?.certificateByCEO?.commissionExpiries}</p>
          </div>
        </div>
      </div>
      <div style="">
        <img src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692865462387_commonlands-certificate.svg" alt="certificate" style="height: 100%; width: 120px;" />
      </div>
    </div>
  </div>
`;

  try {
    return await htmlPDF.create(content, options);
  } catch (error) {
    throw error;
  }
};

/**
 * Function used for encrypting pdf file
 * @param {String} fileName - name of file
 * @param {String} targetHash - target hash
 * @param {String} did - did
 * @returns {Promise} - Promise of encrypted pdf file
 */
const encryptPdf = async ({ fileName, targetHash, did }) => {
  try {
    const pdfDoc = await PDFDocument.load(
      fs.readFileSync(`./assets/pdf/${fileName}.pdf`)
    );
    const originalCreationDate = pdfDoc.getCreationDate();
    const originalModificationDate = pdfDoc.getModificationDate();
    pdfDoc.setKeywords([`targetHash:${targetHash}`, `did:${did}`]);
    pdfDoc.setCreationDate(new Date(process.env.HASH_DATE));
    pdfDoc.setModificationDate(new Date(process.env.HASH_DATE));
    pdfDoc.setProducer(process.env.COMPANY_NAME);
    const pdfBytes = await pdfDoc.save();
    const hash = crypto.createHash("sha256");
    hash.update(pdfBytes);
    const hashHex = hash.digest("hex");
    pdfDoc.setCreationDate(originalCreationDate);
    pdfDoc.setModificationDate(originalModificationDate);
    pdfDoc.setKeywords([
      `targetHash:${targetHash}`,
      `did:${did}`,
      `hash:${hashHex}`,
      `fileName:${fileName}`,
    ]);
    const updatedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(`./assets/pdf/${fileName}.pdf`, updatedPdfBytes);
  } catch (e) {
    throw e;
  }
};

async function getPdfBufferFromUrl(pdfUrl) {
  try {
    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer", // Set the response type to arraybuffer
    });

    if (response.status === 200) {
      const pdfBuffer = Buffer.from(response.data);
      return pdfBuffer;
    } else {
      throw new Error(
        `Failed to fetch PDF from URL. Status code: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error fetching PDF:", error.message);
    throw error;
  }
}

async function bufferToPDFDocument(buffer) {
  const pdfDoc = await PDFDocument.load(buffer);
  return pdfDoc;
}

const verifyPdf = async ({ url }) => {
  try {
    const pdfDocBuffer = await getPdfBufferFromUrl(url);
    const pdfDoc = await bufferToPDFDocument(pdfDocBuffer);
    const originalCreationDate = pdfDoc.getCreationDate();
    const originalModificationDate = pdfDoc.getModificationDate();
    const keywords = pdfDoc.getKeywords();
    const targetHash = keywords.split(" ")[0].split(":")[1];
    const didParameters = keywords.split(" ")[1].split(":");
    const fileName = keywords.split(" ")[3].split(":")[1];
    const did =
      didParameters[1] +
      ":" +
      didParameters[2] +
      ":" +
      didParameters[3] +
      ":" +
      didParameters[4];
    const pdfHash = keywords.split(" ")[2].split(":")[1];
    if (!pdfHash || !did || !targetHash) {
      throw {
        error_code: 400,
        error_message: "Error while getting document information!",
      };
    }
    pdfDoc.setKeywords([`targetHash:${targetHash}`, `did:${did}`]);
    pdfDoc.setCreationDate(new Date(process.env.HASH_DATE));
    pdfDoc.setModificationDate(new Date(process.env.HASH_DATE));
    pdfDoc.setProducer(process.env.COMPANY_NAME);
    const pdfBytes = await pdfDoc.save();
    const hash = crypto.createHash("sha256");
    hash.update(pdfBytes);
    const hashHex = hash.digest("hex");
    if (hashHex !== pdfHash) {
      throw {
        error_code: 400,
        error_message: "PDF has been modified! Please check your PDF again!",
      };
    }
    pdfDoc.setCreationDate(originalCreationDate);
    pdfDoc.setModificationDate(originalModificationDate);
    pdfDoc.setKeywords([
      `targetHash:${targetHash}`,
      `did:${did}`,
      `hash:${hashHex}`,
      `fileName:${fileName}`,
    ]);
    const updatedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(`./assets/pdf/${fileName}.pdf`, updatedPdfBytes);
    const accessToken = await authenticationProgress();
    const { wrappedDoc } = await getDocumentContentByDid({
      did: did,
      accessToken: accessToken,
    });
    await verifyWrappedDocument(wrappedDoc, " ", "cardano");
    return {
      valid: true,
    };
  } catch (e) {
    throw e;
  }
};

/**
 * Function used for reading pdf file
 * @param {String} fileName
 * @returns {Promise} - Promise of pdf file
 */
const readPdf = async ({ fileName }) => {
  try {
    const pdfDoc = await PDFDocument.load(
      fs.readFileSync(`./assets/pdf/${fileName}.pdf`)
    );
    return pdfDoc;
  } catch (e) {
    throw e;
  }
};

export {
  createPdf,
  encryptPdf,
  readPdf,
  verifyPdf,
  getPdfBufferFromUrl,
  bufferToPDFDocument,
};
