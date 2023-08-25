// * Utilities
import crypto from "node:crypto";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import {
  readPdf,
  verifyPdf,
  getPdfBufferFromUrl,
  bufferToPDFDocument,
} from "../../../core/utils/pdf.js";
import { getDocumentContentByDid } from "../../../core/utils/controller.js";
import { authenticationProgress } from "../../../core/utils/auth.js";
import axios from "axios";
import { checkUndefinedVar } from "../../../core/index.js";
import logger from "../../../logger.js";

// * Constants
import { ERRORS, SERVERS } from "../../../core/constants.js";

export default {
  savePdfFile: async (req, res) => {
    try {
      const { pdfName, targetHash, did } = req.body;
      const pdfDoc = await PDFDocument.load(
        fs.readFileSync(`./assets/pdf/${pdfName}.pdf`)
      );
      const originalCreationDate = pdfDoc.getCreationDate();
      const originalModificationDate = pdfDoc.getModificationDate();
      pdfDoc.setKeywords([`targetHash:${targetHash}`, `did:${did}`]);
      pdfDoc.setCreationDate(new Date(2023, 5, 30));
      pdfDoc.setModificationDate(new Date(2023, 5, 30));
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
      ]);
      const updatedPdfBytes = await pdfDoc.save();
      fs.writeFileSync(`./assets/pdf/${pdfName}.pdf`, updatedPdfBytes);
      return res.status(200).json({
        hash: hashHex,
      });
    } catch (error) {
      error?.error_code
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
  readPdfFile: async (req, res) => {
    try {
      const { fileName } = req.query;
      const undefinedVar = checkUndefinedVar({
        fileName,
      });
      if (undefinedVar.undefined) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify(undefinedVar?.detail)}`
        );
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const pdf = await readPdf({
        fileName: fileName,
      });
      return res.status(200).json({
        message: "SUCCESS",
      });
    } catch (error) {
      error?.error_code
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
  verifyPdfFile: async (req, res) => {
    try {
      const { url } = req.body;
      const undefinedVar = checkUndefinedVar({
        url,
      });
      if (undefinedVar.undefined) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify(undefinedVar?.detail)}`
        );
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const { valid } = await verifyPdf({
        url: url,
      });
      if (valid) {
        return res.status(200).json({
          isValid: true,
        });
      }
      return res.status(200).json({
        error_code: 200,
        error_message: "This PDF file is not valid!",
      });
    } catch (error) {
      error?.error_code
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
  revokePdfFile: async (req, res) => {
    try {
      const { url, config } = req.body;
      if (!url && !config) {
        return res.status(200).json(ERRORS?.MISSING_PARAMETERS);
      }
      let mintingConfig = config;
      const accessToken = await authenticationProgress();
      if (url) {
        const pdfBuffer = await getPdfBufferFromUrl(url);
        const pdfDoc = await bufferToPDFDocument(pdfBuffer);
        const keywords = pdfDoc.getKeywords();
        const didParameters = keywords.split(" ")[1].split(":");
        const did =
          didParameters[1] +
          ":" +
          didParameters[2] +
          ":" +
          didParameters[3] +
          ":" +
          didParameters[4];
        const { wrappedDoc } = await getDocumentContentByDid({
          did: did,
          accessToken: accessToken,
        });
        mintingConfig = wrappedDoc?.mintingNFTConfig;
      }
      const revokeResponse = await axios.delete(
        SERVERS.CARDANO_SERVICE + "/api/v2/hash",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken};`,
          },
          data: { config: mintingConfig },
        }
      );
      if (revokeResponse?.data?.code !== 0) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify(revokeResponse?.data)}`
        );
        return res.status(200).json(ERRORS?.REVOKE_DOCUMENT_FAILED);
      }
      logger.apiInfo(req, res, `Revoke document successfully!`);
      return res.status(200).json({
        revoke: true,
      });
    } catch (error) {
      error?.error_code
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
};
