// * Constants
import { SERVERS } from "../../config/constants.js";
import { ERRORS } from "../../config/errors/error.constants.js";
import { COMMONLANDS_SCHEMAS } from "../../config/schemas/index.js";

// * Utilities
import axios from "axios";
import { sha256 } from "js-sha256";
import "dotenv/config";
import {
  checkUndefinedVar,
  getPublicKeyFromAddress,
  validateJSONSchema,
  validateDID,
} from "../utils/index.js";
import { createDocumentForCommonlands } from "../utils/document.js";
import fs from "fs";
import FormData from "form-data";
import { getAccountBySeedPhrase } from "../utils/lucid.js";
import {
  getDocumentContentByDid,
  updateDocumentDid,
  getDidDocumentByDid,
} from "../utils/controller.js";
import {
  encryptPdf,
  getPdfBufferFromUrl,
  deleteFile,
  createCommonlandsContract,
  verifyPdf,
  readContentOfPdf,
} from "../utils/pdf.js";
import { unsalt, deepUnsalt } from "../../fuixlabs-documentor/utils/data.js";
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import logger from "../../../logger.js";
import {
  createVerifiableCredential,
  getAndVerifyCredential,
} from "../utils/credential.js";

// * Helpers
import {
  AuthHelper,
  CardanoHelper,
  ControllerHelper,
} from "../helpers/index.js";

axios.defaults.withCredentials = true;

export default {
  createContract: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Create Commonlands Contract`);
      const { content, companyName: _companyName, id } = req.body;
      const undefinedVar = checkUndefinedVar({
        content,
        id,
      });
      if (undefinedVar.undefined) {
        return next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const accessToken = await AuthHelper.authenticationProgress();
      const companyName = _companyName || process.env.COMPANY_NAME;
      const valid = validateJSONSchema(
        COMMONLANDS_SCHEMAS?.COMMONLANDS_CONTRACT,
        content
      );
      if (!valid.valid) return next(ERRORS.INVALID_INPUT);
      const contractFileName = `Contract-${id}`;
      const isExistedResponse = await ControllerHelper.isExisted({
        companyName: companyName,
        fileName: contractFileName,
        accessToken: accessToken,
      });
      if (isExistedResponse?.data?.error_code) {
        return next(isExistedResponse?.data || ERRORS.DOCUMENT_IS_EXISTED);
      }
      if (isExistedResponse?.data?.isExisted) {
        return next(ERRORS?.DOCUMENT_IS_EXISTED);
      }
      const contractContent = {
        ...content,
        fileName: contractFileName,
        name: `Commonlands Contract`,
      };
      const { currentWallet, lucidClient } = await getAccountBySeedPhrase({
        seedPhrase: process.env.ADMIN_SEED_PHRASE,
      });
      const { wrappedDocument } = await createDocumentForCommonlands({
        seedPhrase: process.env.ADMIN_SEED_PHRASE,
        documents: [contractContent],
        address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
        access_token: accessToken,
        client: lucidClient,
        currentWallet: currentWallet,
        companyName: companyName,
      });
      const documentDid = generateDid(
        companyName,
        unsalt(wrappedDocument?.data?.fileName)
      );
      if (!documentDid) {
        return next(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      const documentHash = wrappedDocument?.signature?.targetHash;
      logger.apiInfo(
        req,
        res,
        `Wrapped document ${JSON.stringify(wrappedDocument)}`
      );
      await createCommonlandsContract({
        fileName: contractFileName,
        data: contractContent,
      }).catch((error) => {
        return next({
          error_code: 400,
          error_message: error?.message || error || "Error while creating PDF",
        });
      });
      logger.apiInfo(
        req,
        res,
        `Created PDF file ${contractFileName} successfully!`
      );
      await encryptPdf({
        fileName: contractFileName,
        did: documentDid,
        targetHash: documentHash,
      });
      const formData = new FormData();
      formData.append(
        "uploadedFile",
        fs.readFileSync(`./assets/pdf/${contractFileName}.pdf`),
        {
          filename: `${companyName}-${contractFileName}.pdf`,
        }
      );
      const uploadResponse = await axios.post(
        `${SERVERS?.COMMONLANDS_GITHUB_SERVICE}/api/git/upload/file`,
        formData
      );
      if (uploadResponse?.data?.error_code) {
        return next(uploadResponse?.data);
      }
      await deleteFile(`./assets/pdf/${contractFileName}.pdf`);
      const didResponse = await getDidDocumentByDid({
        did: documentDid,
        accessToken: accessToken,
      });
      if (!didResponse?.didDoc) {
        return next(ERRORS.CANNOT_GET_DID_DOCUMENT);
      }
      const updateDidDoc = {
        ...didResponse?.didDoc,
        pdfUrl: uploadResponse?.data?.url,
      };
      const updateDidDocResponse = await updateDocumentDid({
        did: documentDid,
        accessToken: accessToken,
        didDoc: updateDidDoc,
      });
      if (updateDidDocResponse?.error_code) {
        return next(ERRORS.ERROR_PUSH_URL_TO_DID_DOCUMENT);
      }
      return res.status(200).json({
        did: documentDid,
        url: uploadResponse?.data?.url,
      });
    } catch (error) {
      error?.error_code
        ? next(error)
        : next({
            error_code: 400,
            error_message:
              error?.error_message || error?.message || "Something went wrong!",
          });
    }
  },
  assignCredentialToContract: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Assign Credential To Contract`);
      const { contractDid, signData, issuerKey, metadata } = req.body;
      const undefinedVar = checkUndefinedVar({
        contractDid,
        signData,
        issuerKey,
        metadata,
      });
      if (undefinedVar.undefined) {
        return next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const { valid } = validateDID(contractDid);
      if (!valid) {
        return next(ERRORS.INVALID_DID);
      }
      const validMetadata = validateJSONSchema(
        COMMONLANDS_SCHEMAS?.ASSIGN_CREDENTIAL_METADATA,
        metadata
      );
      if (!validMetadata.valid) {
        return next({
          ...ERRORS.INVALID_INPUT,
          detail:
            "Metadata field is invalid! Make sure you have all required fields!",
        });
      }
      const accessToken = await AuthHelper.authenticationProgress();
      const certificateDidResponse = await getDidDocumentByDid({
        did: metadata?.certificateDid,
        accessToken: accessToken,
      });
      if (certificateDidResponse?.error_code) {
        return next(certificateDidResponse || ERRORS.CANNOT_GET_DID_DOCUMENT);
      }
      const lockedWithContract =
        certificateDidResponse?.didDoc?.metadata?.lockedWithContract;
      if (lockedWithContract) {
        return next(ERRORS.CERTIFICATE_DID_IS_LOCKED_WITH_CONTRACT);
      }
      const documentContent = await getDocumentContentByDid({
        did: contractDid,
        accessToken: accessToken,
      });
      if (documentContent?.error_code) {
        return next(documentContent || ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      const { wrappedDoc } = documentContent;
      const documentHash = wrappedDoc?.signature?.targetHash;
      const mintingConfig = wrappedDoc?.mintingNFTConfig;
      const { credential } = await createVerifiableCredential({
        metadata: metadata,
        did: contractDid,
        subject: {
          object: contractDid,
          action: {
            code: 1,
            proofHash: documentHash,
          },
          signData: signData,
          issuerKey: issuerKey,
        },
      });
      const verifiedCredential = {
        ...credential,
        timestamp: Date.now(),
      };
      const credentialHash = sha256(
        Buffer.from(JSON.stringify(verifiedCredential), "utf8").toString("hex")
      );
      const credentialResponse = await CardanoHelper.storeCredentials({
        credentialHash: credentialHash,
        accessToken: accessToken,
        mintingConfig: mintingConfig,
      });
      if (credentialResponse?.data?.code !== 0) {
        return next({
          ...ERRORS.CREDENTIAL_FAILED,
          detail: credentialResponse?.data,
        });
      }
      const storeCredentialStatus = await ControllerHelper.storeCredentials({
        credential: {
          ...verifiedCredential,
          mintingNFTConfig: credentialResponse?.data?.data,
        },
        credentialHash: credentialHash,
        accessToken: accessToken,
      });
      if (storeCredentialStatus?.data?.error_code) {
        return next(storeCredentialStatus?.data);
      }
      const updatedDidDocResponse = await updateDocumentDid({
        did: metadata?.certificateDid,
        accessToken: accessToken,
        didDoc: {
          ...certificateDidResponse?.didDoc,
          metadata: {
            ...certificateDidResponse?.didDoc?.metadata,
            lockedWithContract: contractDid,
          },
        },
      });
      if (updatedDidDocResponse?.error_code) {
        return next(
          updatedDidDocResponse || ERRORS.CANNOT_UPDATE_DOCUMENT_INFORMATION
        );
      }
      logger.apiInfo(req, res, `Created credential hash ${credentialHash}`);
      return res.status(200).json({
        success: true,
        success_message: "Credential is created successfully!",
        credentialHash: credentialHash,
      });
    } catch (error) {
      error?.error_code
        ? next(error)
        : next({
            error_code: 400,
            error_message:
              error?.error_message || error?.message || "Something went wrong!",
          });
    }
  },
  unlockCertificateFromContract: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Unlock Certificate From Contract`);
      const { certificateDid } = req.body;
      const undefinedVar = checkUndefinedVar({
        certificateDid,
      });
      if (undefinedVar.undefined) {
        return next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const isValidCertificateDid = validateDID(certificateDid);
      if (!isValidCertificateDid.valid) {
        return next(ERRORS.INVALID_DID);
      }
      const accessToken = await AuthHelper.authenticationProgress();
      const certificateDidResponse = await getDidDocumentByDid({
        did: certificateDid,
        accessToken: accessToken,
      });
      if (certificateDidResponse?.error_code) {
        return next(certificateDidResponse || ERRORS.CANNOT_GET_DID_DOCUMENT);
      }
      logger.apiInfo(
        req,
        res,
        `Certificate DID: ${JSON.stringify(certificateDidResponse?.didDoc)}`
      );
      const lockedWithContract =
        certificateDidResponse?.didDoc?.metadata?.lockedWithContract;
      if (!lockedWithContract) {
        return next(ERRORS.CERTIFICATE_DID_IS_NOT_LOCKED_WITH_CONTRACT);
      }
      const willUpdateDidDoc = {
        ...certificateDidResponse?.didDoc,
      };
      delete willUpdateDidDoc?.metadata;
      const updatedDidDocResponse = await updateDocumentDid({
        did: certificateDid,
        accessToken: accessToken,
        didDoc: willUpdateDidDoc,
      });
      if (updatedDidDocResponse?.error_code) {
        return next(
          updatedDidDocResponse || ERRORS.CANNOT_UPDATE_DOCUMENT_INFORMATION
        );
      }
      return res.status(200).json({
        success: true,
        success_message: "Unlock certificate successfully!",
        certificateDid: certificateDid,
      });
    } catch (error) {
      error?.error_code
        ? next(error)
        : next({
            error_code: 400,
            error_message:
              error?.error_message || error?.message || "Something went wrong!",
          });
    }
  },
  getLockedStatus: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Get Locked Status`);
      const { certificateDid } = req.query;
      const undefinedVar = checkUndefinedVar({
        certificateDid,
      });
      if (undefinedVar.undefined) {
        return next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const isValidCertificateDid = validateDID(certificateDid);
      if (!isValidCertificateDid.valid) {
        return next(ERRORS.INVALID_DID);
      }
      const accessToken = await AuthHelper.authenticationProgress();
      const certificateDidResponse = await getDidDocumentByDid({
        accessToken: accessToken,
        did: certificateDid,
      });
      if (certificateDidResponse?.error_code) {
        return next(certificateDidResponse || ERRORS.CANNOT_GET_DID_DOCUMENT);
      }
      const lockedWithContract =
        certificateDidResponse?.didDoc?.metadata?.lockedWithContract;
      return res.status(200).json({
        success: true,
        isLocked: lockedWithContract ? true : false,
        lockedWithContract: lockedWithContract,
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
  verifyContract: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Verify Commonlands Contract`);
      const uploadedFile = req.file;
      const { url } = req.body;
      if (!url && !uploadedFile) {
        next(ERRORS.MISSING_PARAMETERS);
      }
      const contractBuffer = uploadedFile
        ? uploadedFile?.buffer
        : await getPdfBufferFromUrl(url);
      const { valid } = await verifyPdf({
        buffer: contractBuffer,
      });
      if (!valid) {
        next(ERRORS.COMMONLANDS_CONTRACT_IS_NOT_VALID);
      }
      return res.status(200).json({
        success: true,
        success_message: "Verify contract successfully!",
        isValid: true,
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
  getContract: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Get Commonlands Contract`);
      const { did } = req.query;
      const undefinedVar = checkUndefinedVar({
        did,
      });
      if (undefinedVar.undefined) {
        next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      logger.apiInfo(req, res, `API Request: Get Commonlands Contract: ${did}`);
      const accessToken = await AuthHelper.authenticationProgress();
      const docContentResponse = await getDocumentContentByDid({
        did: did,
        accessToken: accessToken,
      });
      if (docContentResponse?.error_code) {
        return next(ERRORS?.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      logger.apiInfo(
        req,
        res,
        `Response from service: ${JSON.stringify(
          docContentResponse?.wrappedDoc
        )}`
      );
      return res
        .status(200)
        .json(deepUnsalt(docContentResponse?.wrappedDoc?.data));
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
