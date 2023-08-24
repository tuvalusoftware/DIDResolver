import crypto from "node:crypto";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import { createPdf } from "../../../core/utils/pdf.js";

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
      return error.response
        ? res.status(400).json(error?.response?.data)
        : res.status(400).json(error);
    }
  },
  savePdfToDatabase: async (req, res) => {
    try {
      await createPdf({
        fileName: "",
      });
      return res.status(200).json({});
    } catch (error) {
      return error.response
        ? res.status(400).json(error?.response?.data)
        : res.status(400).json(error);
    }
  },
};
