// * Utilities
import crypto from "node:crypto";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import { readPdf, verifyPdf } from "../../../core/utils/pdf.js";
import { checkUndefinedVar } from "../../../core/index.js";
import logger from "../../../logger.js";

// * Constants
import { ERRORS } from "../../../core/constants.js";

export default {
  savePdfFile: async (req, res, next) => {
    try {
      const { pdfName, targetHash, did } = req.body;
      const undefinedVar = checkUndefinedVar({
        pdfName,
        targetHash,
        did,
      });
      if (undefinedVar.undefined) {
        next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
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
        ? next(error)
        : next({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
  readPdfFile: async (req, res, next) => {
    try {
      const { fileName } = req.query;
      const undefinedVar = checkUndefinedVar({
        fileName,
      });
      if (undefinedVar.undefined) {
        next({
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
        ? next(error)
        : next({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
  verifyPdfFile: async (req, res, next) => {
    try {
      const { url } = req.body;
      const undefinedVar = checkUndefinedVar({
        url,
      });
      if (undefinedVar.undefined) {
        next({
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
      next({
        error_code: 400,
        error_message: "This PDF file is not valid!",
      });
    } catch (error) {
      error?.error_code
        ? next(error)
        : next({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
  verifyUploadedPdf: async (req, res, next) => {
    try {
      const uploadedFile = req.file;
      if (!uploadedFile) {
        next({
          error_code: 400,
          error_message: "Missing file!",
        });
      }
      const { valid } = await verifyPdf({
        buffer: uploadedFile?.buffer,
      });
      if (valid) {
        return res.status(200).json({
          isValid: true,
        });
      }
      next({
        error_code: 400,
        error_message: "This PDF file is not valid!",
      });
    } catch (error) {
      error?.error_code
        ? next(error)
        : next({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
};
