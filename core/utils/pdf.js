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
    width: "180mm" /* A4 width in millimeters */,
    height: "270mm" /* A4 height in millimeters */,
    path: `./assets/pdf/${fileName}.pdf`, // you can pass path to save the file
  };

  const content = `
      <div style="
      border-radius: 4px;
      background-color: #fff;
      width: 180mm; /* A4 width in millimeters */
      height: 260mm; /* A4 height in millimeters */
      font-family: Roboto, sans-serif
    ">
        <p style="padding-left: 20px; color: rgba(0, 0, 0, 0.50);
        font-size: 10px;
        font-weight: 400;">View a digital version including more details visit:
          https://commonlands.org/viewmap/plot-256aaa-001</p>
        <div
          style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 20px;">
          <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
            <img src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692850294707_commonlands.svg"
              alt="commonlands" style="height: 62px; width: 55px; margin-right: 30px;" />
            <div style="display: flex; flex-direction: column; margin-left: 20px;">
              <span style="font-size: 21px; font-weight: bold; line-height: 40px; white-space: nowrap;">Land
                Certificate</span>
              <span style="font-size: 10px; line-height: 20px;">No. ${data?.No}</span>
              <span style="font-size: 10px; line-height: 20px;">Date Issued: ${data?.dateIssue}</span>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end;">
            <img style='
              height: 90px;
              width: 90px;
            ' src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1693415966212_qrcode.svg"
              alt="qrcode" />
            <span
              style="color: rgba(0, 0, 0, 0.50); font-size: 10px; font-weight: 400; margin-top: 10px; font-style: italic;">Scan
              the QR code
              to verify the
              authenticity of this Certificate</span>
          </div>
        </div>
        <div style="border-top: 1px solid rgba(0, 0, 0, 0.15); margin-top: 0px;">
          <div style="display: flex; flex-direction: row;">
            <div
              style="width: 200px; border-right: 1px solid rgba(0, 0, 0, 0.15); display: flex; justify-content: center; padding-top: 15px;">
              <img src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1693553688989_avatar.svg"
                alt="profile" style="
                width: 111px;
                height: 150px;
                border-radius: 12px;
                " />
            </div>
            <div style="width: 100%; font-size: 11px;">
              <div
                style="display: flex; flex-direction: row; align-items: center ; border-bottom: 1px solid rgba(0, 0, 0, 0.15); width: 100%;">
                <div
                  style='width: 100%; border-right: 1px solid rgba(0, 0, 0, 0.15); height: 45px; display: flex; align-items: center; padding-left: 15px;'>
                  <span>Claimant: <b>${data?.personalInformation?.claimant}</b></span>
                </div>
                <div style="display: flex; flex-direction: row; align-items: center; width: 100%; padding: 10px">
                  <span>Right to Claim: </span>
                  <div
                    style="border-radius: 21px; background: #3A97AD; color: #FFF; font-weight: bold; padding: 7px; margin-left: 10px;">
                    ${data?.personalInformation?.right}</div>
                </div>
              </div>
              <div style='
                border-bottom: 1px solid rgba(0, 0, 0, 0.15);
                padding: 10px 15px
              '>
                <span>Phone Number: <b>${data?.personalInformation?.phoneNumber}</b><br /></span>
                <div style="margin-top: 8px;">
                  <span style='
                    color: rgba(0, 0, 0, 0.50); font-style: italic;
                  '>Verifier can use the old phone number to search this plot on commonlands </span>
                </div>
              </div>
              <div
                style="display: flex; flex-direction: row; align-items: center; padding: 15px; padding-bottom: 0px; font-size: 11px;">
                <p>Claimrank:</p>
                <div
                  style="margin-left: 10px; background-color: #3EBF84; border-radius: 21px; padding: 5px 10px; font-size: 10px; font-weight: bold; color: #FFF;">
                  ${data?.personalInformation?.claimrank}</div>
              </div>
              <div style='padding: 15px; padding-top: 0px;'>
                <span style="margin-top: 0px; font-weight: bold;">${data?.personalInformation?.description}</span>
              </div>
            </div>
          </div>
          <!-- More content here -->
        </div>
        <div style="border-top: 1px solid rgba(0, 0, 0, 0.15);display: flex; align-items: center; font-size: 11px;">
          <div
            style="display: flex; align-items: center; min-width: 140px; justify-content: flex-end; padding-right: 10px;">
            <p>Plot Name: </p>
          </div>
          <div
            style="font-weight: bold; border-left: 1px solid rgba(0, 0, 0, 0.15); height: 50px; padding-left: 15px; display: flex; align-items: center; justify-content: center;">
            <span>${data?.plotInformation?.plotName}</span>
          </div>
        </div>
        <div style="border-top: 1px solid rgba(0, 0, 0, 0.15); ; display: flex; align-items: center; font-size: 11px">
          <div style="min-width: 140px; display: flex; justify-content: flex-end; padding-right: 10px;">
            <p>Plot ID</p>
          </div>
          <div
            style="grid-column: 3; font-weight: bold; border-left: 1px solid rgba(0, 0, 0, 0.15); height: 50px; padding-left: 15px; display: flex; align-items: center;">
            ${data?.plotInformation?.plotId}
          </div>
        </div>
        <div style="border-top: 1px solid rgba(0, 0, 0, 0.15); display: flex; align-items: center; font-size: 11px">
          <div
            style="min-width: 140px; display: flex; justify-content: flex-end; padding-right: 10px; border-right: 1px solid rgba(0, 0, 0, 0.15); height: 150px; padding-top: 10px;">
            <span>Plot Status</span>
          </div>
          <div style="grid-column: 9; min-height: 140px; padding-left: 15px; display: flex; flex-direction: column;">
            <span style="margin-bottom: 10px; font-weight: bold;">
              This plot has been granted an official Commonlands Certificate and is in good standing. Owners are free to
              utilize the plot for securing contracts if desired and have the ability to sell or trade it.
            </span>
            <div style="border-radius: 28px; background: #5EC4AC; width: fit-content; padding: 5px 10px;">
              <span style="font-weight: bold; color: #FFF; font-size: 10px;">
                ${data?.plotInformation?.plotStatus}
              </span>
            </div>
          </div>
        </div>
        <div style="border-top: 1px solid rgba(0, 0, 0, 0.15);display: flex; align-items: center; font-size: 11px">
          <div
            style="display: flex; align-items: center; min-width: 140px; justify-content: flex-end; padding-right: 10px;">
            <p>Plot People </p>
          </div>
          <div
            style="font-weight: bold; border-left: 1px solid rgba(0, 0, 0, 0.15); height: 50px; padding-left: 15px; display: flex;align-items: center;">
            <span>${data?.plotInformation?.plotName}</span>
          </div>
        </div>
        <div
          style="border-top: 1px solid rgba(0, 0, 0, 0.15); border-bottom: 1px solid rgba(0, 0, 0, 0.15); ;display: flex; align-items: center; font-size: 11px;">
          <div style="min-width: 140px; display: flex; justify-content: flex-end; padding-right: 10px;">
            <p>Plot Location</p>
          </div>
          <div
            style="grid-column: 3; font-weight: bold; border-left: 1px solid rgba(0, 0, 0, 0.15); height: 50px; display: flex; align-items: center; padding-left: 15px;">
            ${data?.plotInformation?.plotLocation}
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 4.5fr 4.5fr 3fr; white-space: nowrap; font-size: 10px;">
          <div style="border-right: 1px solid rgba(0, 0, 0, 0.15); padding: 20px">
            <div>
              <span style="font-weight: bold; font-size: 12px;">Certificate by Commonlands</span>
              <div style="display: flex; flex-direction: row; align-items: flex-end; margin-top: 25px;">
                <span style="width: 60%">Public Signature</span>
                <div
                  style="border-bottom: 2px solid #000; display: flex; flex-direction: row; align-items: center; width: 100%; justify-content: center; align-items: center;">
                  <img
                    src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692850451282_commonlands-signature.svg"
                    style="height: 40px; width: 80px;" alt="commonlands-signature" />
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: row; align-items: flex-end; width: 100%;">
              <span>Name</span>
              <div
                style="border-bottom: 2px solid #000; margin-left: 5px; display: flex; flex-direction: row; align-items: center; width: 100%; margin-top: 0px; justify-content: center;">
                <span style="line-height: 30px;">${data?.certificateByCommonlands?.name}</span>
              </div>
            </div>
            <div style="display: flex; flex-direction: row; align-items: flex-end; width: 100%;">
              <span>Public Key</span>
              <div
                style="border-bottom: 2px solid #000; margin-left: 5px; display: flex; flex-direction: row; align-items: center; width: 100%; margin-top: 0px; justify-content: center">
                <span style="line-height: 30px;">Commonlands Systems LLC</span>
              </div>
            </div>
          </div>
          <div style="padding: 20px;">
            <div>
              <span style="font-weight: bold; font-size: 12px;">Certification by CEO</span>
              <div style="display: flex; flex-direction: row; align-items: flex-end; margin-top: 25px;">
                <span style="width: 60%">Public Signature</span>
                <div
                  style="border-bottom: 2px solid #000; display: flex; flex-direction: row; align-items: center; width: 100%; justify-content: center;">
                  <img
                    src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1693592619798_darius-signature.svg"
                    style="height: 40px; width: 80px;" alt="commonlands-signature" />
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: row; align-items: flex-end; width: 100%;">
              <span>Name</span>
              <div
                style="border-bottom: 2px solid #000; margin-left: 5px; display: flex; flex-direction: row; align-items: center; width: 100%; margin-top: 0px; justify-content: center;">
                <span style="line-height: 30px;">${data?.certificateByCEO?.name}</span>
              </div>
            </div>
            <div style="display: flex; flex-direction: row; align-items: flex-end; width: 100%;">
              <span>Public Key</span>
              <div
                style="border-bottom: 2px solid #000; margin-left: 5px; display: flex; flex-direction: row; align-items: center; width: 100%; margin-top: 0px; justify-content: center;">
                <span style="line-height: 30px;">Commonlands Systems LLC</span>
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: center; align-items: center;">
            <img
              src="https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692865462387_commonlands-certificate.svg"
              alt="certificate" style="height: 120px; width: 120px;" />
          </div>
        </div>
        <div style='
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.15);
          color: rgba(0, 0, 0, 0.50);
          font-size: 10px;
        '>
          <span>
            Copyright © 2023 Commonlands.All rights reserved.
          </span>
          <span>
            https://commonlands.org
          </span>
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

/**
 * Function used for getting pdf buffer from url
 * @param {String} pdfUrl
 * @returns {Buffer} - Buffer of pdf file
 */
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

/**
 * Function used for converting buffer to pdf document
 * @param {Buffer} buffer
 * @returns {PDFDocument}
 */
async function bufferToPDFDocument(buffer) {
  const pdfDoc = await PDFDocument.load(buffer);
  return pdfDoc;
}

async function deleteFile(path) {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

/**
 * Function used for verifying pdf file by given url on AWS S3
 * @param {String} url -
 * @returns {Object} - { valid: true } if valid, throw error otherwise
 */
const verifyPdf = async ({ url, buffer }) => {
  try {
    let pdfDocBuffer = buffer;
    if (url) {
      pdfDocBuffer = await getPdfBufferFromUrl(url);
    }
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
  deleteFile,
};
