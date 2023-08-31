// * Constants
import { ERRORS, SERVERS } from "../../../core/constants.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import {
  checkUndefinedVar,
  getCurrentDateTime,
  getPublicKeyFromAddress,
} from "../../../core/index.js";
import {
  createDocumentForCommonlands,
  hashDocumentContent,
} from "../../../core/document.js";
import fs from "fs";
import FormData from "form-data";
import { getAccountBySeedPhrase } from "../../../core/utils/lucid.js";
import { authenticationProgress } from "../../../core/utils/auth.js";
import { getDocumentContentByDid } from "../../../core/utils/controller.js";
import {
  createPdf,
  encryptPdf,
  getPdfBufferFromUrl,
  bufferToPDFDocument,
  deleteFile,
} from "../../../core/utils/pdf.js";
import { unsalt } from "../../../fuixlabs-documentor/utils/data.js";
import logger from "../../../logger.js";

axios.defaults.withCredentials = true;

export default {
  createDocument: async (req, res) => {
    try {
      logger.apiInfo(
        req,
        res,
        `API Request: Create Document using Seed Phrase`
      );
      const { plot, owner } = req.body;
      const accessToken = await authenticationProgress();
      const secretKey = process.env.COMMONLANDS_SECRET_KEY;
      const undefinedVar = checkUndefinedVar({
        plot,
        accessToken,
        owner,
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
      const pdfFileName =
        `LandCertificate-${owner?.phoneNumber.replace("+", "")}-${plot?._id}` ||
        "";
      const isExistedResponse = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/doc/exists",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${secretKey}`,
          },
          params: {
            companyName: process.env.COMPANY_NAME,
            fileName: pdfFileName,
          },
        }
      );
      if (isExistedResponse?.data?.isExisted) {
        logger.apiError(req, res, `Document existed: ${pdfFileName}`);
        return res.status(200).json(ERRORS.DOCUMENT_IS_EXISTED);
      }
      const plotDetailForm = {
        profileImage: "sampleProfileImage",
        fileName: pdfFileName,
        name: `Land Certificate`,
        title: `Land-Certificate-${plot?.name || ""}`,
        No: plot?.no || "CML21566325",
        dateIssue: getCurrentDateTime(),
        personalInformation: {
          claimant: owner?.fullName || "",
          right: owner?.role || "",
          phoneNumber: owner?.phoneNumber || "",
          claimrank: "okay",
          description:
            "Okay is the starting point. This level may have some boundaries unverified and may include one boundary dispute. If there is an ownership dispute of a plot but and one of the owners is part of a claimchain and the other’s has not completed a claimchain, the completed claimchain person will be listed as Okay. ",
        },
        plotInformation: {
          plotName: plot?.name || "",
          plotId: plot?.id || "",
          plotStatus: "Free & Clear",
          plotPeople: "Verified by 3 claimants, 6 Neighbors",
          plotLocation: plot?.placeName || "",
        },
        certificateByCommonlands: {
          publicSignature: "commonlandsSignatureImage",
          name: "Commonlands System LLC",
          commissionNumber: "139668234",
          commissionExpiries: "09/12/2030",
        },
        certificateByCEO: {
          publicSignature: "ceoSignature",
          name: "Darius Golkar",
          commissionNumber: "179668234",
          commissionExpiries: "09/12/2030",
        },
      };
      const { currentWallet, lucidClient } = await getAccountBySeedPhrase({
        seedPhrase: process.env.ADMIN_SEED_PHRASE,
      });
      const { wrappedDocument } = await createDocumentForCommonlands({
        seedPhrase: process.env.ADMIN_SEED_PHRASE,
        documents: [plotDetailForm],
        address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
        access_token: accessToken,
        client: lucidClient,
        currentWallet: currentWallet,
      });
      const documentDid = `did:fuixlabs:${process.env.COMPANY_NAME}:${unsalt(
        wrappedDocument?.data?.fileName
      )}`;

      const documentHash = wrappedDocument?.signature?.targetHash;
      if (!documentDid) {
        return res.status(200).json(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      logger.apiInfo(
        req,
        res,
        `Wrapped document ${JSON.stringify(wrappedDocument)}`
      );
      await createPdf({
        fileName: pdfFileName,
        data: plotDetailForm,
      }).catch((error) => {
        return res.status(200).json({
          error_code: 400,
          error_message: error?.message || error || "Error while creating PDF",
        });
      });
      logger.apiInfo(req, res, `Created PDF file ${pdfFileName} successfully!`);
      await encryptPdf({
        fileName: pdfFileName,
        did: documentDid,
        targetHash: documentHash,
      });
      const formData = new FormData();
      formData.append(
        "uploadedFile",
        fs.readFileSync(`./assets/pdf/${pdfFileName}.pdf`),
        {
          filename: `${process.env.COMPANY_NAME}-${pdfFileName}.pdf`,
        }
      );
      const uploadResponse = await axios.post(
        `${SERVERS?.COMMONLANDS_GITHUB_SERVICE}/api/git/upload/file`,
        formData
      );
      logger.apiInfo(
        req,
        res,
        `Response from service: ${JSON.stringify(uploadResponse?.data)}`
      );
      await deleteFile(`./assets/pdf/${pdfFileName}.pdf`);
      return res.status(200).json(uploadResponse?.data);
    } catch (error) {
      logger.apiError(
        req,
        res,
        `Error: ${JSON.stringify(error?.message || error)}`
      );
      return res.status(200).json(error);
    }
  },
  revokeDocument: async (req, res) => {
    try {
      const { url, config } = req.body;
      if (!url && !config) {
        return res.status(200).json(ERRORS?.MISSING_PARAMETERS);
      }
      let mintingConfig = config;
      const accessToken = await authenticationProgress();
      if (url) {
        const pdfBuffer = await getPdfBufferFromUrl(url);
        const document = await bufferToPDFDocument(pdfBuffer);
        const keywords = document.getKeywords();
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
        revoked: true,
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
  multipleDocumentSigning: async (req, res) => {
    try {
      const { content, claimants } = req.body;
      const undefinedVar = checkUndefinedVar({
        content,
        claimants,
      });
      if (undefinedVar.undefined) {
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const accessToken = await authenticationProgress();
      const secretKey = process.env.COMMONLANDS_SECRET_KEY;
      const pdfFileName = `LandCertificate-${new Date().toUTCString()}` || "";
      // const isExistedResponse = await axios.get(
      //   SERVERS.DID_CONTROLLER + "/api/doc/exists",
      //   {
      //     withCredentials: true,
      //     headers: {
      //       Cookie: `access_token=${secretKey}`,
      //     },
      //     params: {
      //       companyName: process.env.COMPANY_NAME,
      //       fileName: pdfFileName,
      //     },
      //   }
      // );
      // if (isExistedResponse?.data?.isExisted) {
      //   logger.apiError(req, res, `Document existed: ${pdfFileName}`);
      //   return res.status(200).json(ERRORS.DOCUMENT_IS_EXISTED);
      // }
      // const { currentWallet, lucidClient } = await getAccountBySeedPhrase({
      //   seedPhrase: process.env.ADMIN_SEED_PHRASE,
      // });
      // const { wrappedDocument } = await createDocumentForCommonlands({
      //   seedPhrase: process.env.ADMIN_SEED_PHRASE,
      //   documents: [content],
      //   address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
      //   access_token: accessToken,
      //   client: lucidClient,
      //   currentWallet: currentWallet,
      // });
      // const documentDid = `did:fuixlabs:${process.env.COMPANY_NAME}:${unsalt(
      //   wrappedDocument?.data?.fileName
      // )}`;
      // const documentHash = wrappedDocument?.signature?.targetHash;
      // if (!documentDid) {
      //   return res.status(200).json(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
      // }
      // logger.apiInfo(
      //   req,
      //   res,
      //   `Wrapped document ${JSON.stringify(wrappedDocument)}`
      // );
      return res.status(200).json({
        message: "Coming soon...",
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
  hashDocument: async (req, res) => {
    try {
      const { plot, claimant } = req.body;
      const undefinedVar = checkUndefinedVar({
        plot,
        claimant,
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
      const pdfFileName =
        `LandCertificate-${claimant?.phoneNumber?.replace("+", "")}-${
          plot?._id
        }` || "";
      const plotDetailForm = {
        profileImage: "sampleProfileImage",
        fileName: pdfFileName,
        name: `Land Certificate`,
        title: `Land-Certificate-${plot?.name || ""}`,
        No: plot?.no || "CML21566325",
        dateIssue: getCurrentDateTime(),
        personalInformation: {
          claimant: claimant?.fullName || "",
          right: claimant?.role || "",
          phoneNumber: claimant?.phoneNumber || "",
          claimrank: "okay",
          description:
            "Okay is the starting point. This level may have some boundaries unverified and may include one boundary dispute. If there is an ownership dispute of a plot but and one of the owners is part of a claimchain and the other’s has not completed a claimchain, the completed claimchain person will be listed as Okay. ",
        },
        plotInformation: {
          plotName: plot?.name || "",
          plotId: plot?.id || "",
          plotStatus: "Free & Clear",
          plotPeople: "Verified by 3 claimants, 6 Neighbors",
          plotLocation: plot?.placeName || "",
        },
        certificateByCommonlands: {
          publicSignature: "commonlandsSignatureImage",
          name: "Commonlands System LLC",
          commissionNumber: "139668234",
          commissionExpiries: "09/12/2030",
        },
        certificateByCEO: {
          publicSignature: "ceoSignature",
          name: "Darius Golkar",
          commissionNumber: "179668234",
          commissionExpiries: "09/12/2030",
        },
      };
      const { currentWallet } = await getAccountBySeedPhrase({
        seedPhrase: process.env.ADMIN_SEED_PHRASE,
      });

      const targetHash = await hashDocumentContent({
        document: plotDetailForm,
        address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
      });
      logger.apiInfo(req, res, `Hash of document: ${targetHash}`);
      return res.status(200).json({
        targetHash,
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
