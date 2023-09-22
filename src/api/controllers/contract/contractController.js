// * Constants
import { ERRORS, SERVERS } from "../../../config/constants.js";
import { COMMONLANDS } from "../../../config/schemas/index.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import {
  checkUndefinedVar,
  getPublicKeyFromAddress,
  validateJSONSchema,
  validateDID,
} from "../../utils/index.js";
import { createDocumentForCommonlands } from "../../utils/document.js";
import fs from "fs";
import FormData from "form-data";
import { getAccountBySeedPhrase } from "../../utils/lucid.js";
import { authenticationProgress } from "../../utils/auth.js";
import {
  getDocumentContentByDid,
  updateDocumentDid,
  getDidDocumentByDid,
} from "../../utils/controller.js";
import {
  encryptPdf,
  getPdfBufferFromUrl,
  deleteFile,
  createCommonlandsContract,
  verifyPdf,
  readContentOfPdf,
} from "../../utils/pdf.js";
import { unsalt, deepUnsalt } from "../../../fuixlabs-documentor/utils/data.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import logger from "../../../../logger.js";
import { getAndVerifyCredential } from "../../utils/credential.js";

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
        next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const accessToken = await authenticationProgress();
      const companyName = _companyName || process.env.COMPANY_NAME;
      const valid = validateJSONSchema(
        COMMONLANDS?.COMMONLANDS_CONTRACT,
        content
      );
      if (!valid.valid)
        next({
          ...ERRORS.INVALID_INPUT,
          detail: valid.detail,
        });
      const contractFileName = `Contract-${id}`;
      const isExistedResponse = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/doc/exists",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken}`,
          },
          params: {
            companyName: companyName,
            fileName: contractFileName,
          },
        }
      );
      if (isExistedResponse?.data?.isExisted) {
        next(ERRORS?.DOCUMENT_IS_EXISTED);
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
        next(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
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
        next({
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
        next(uploadResponse?.data);
      }
      await deleteFile(`./assets/pdf/${contractFileName}.pdf`);
      const didResponse = await getDidDocumentByDid({
        did: documentDid,
        accessToken: accessToken,
      });
      if (!didResponse?.didDoc) {
        next({
          error_code: 400,
          error_message: "Error while getting DID document",
        });
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
        next({
          error_code: 400,
          error_message: "Error while push url to DID document",
        });
      }
      logger.apiInfo(
        req,
        res,
        `Response from service: ${JSON.stringify(uploadResponse?.data)}`
      );
      return res
        .status(200)
        .json({ ...uploadResponse?.data, did: documentDid });
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
      // * Step 1: Verify the contract
      const contractBuffer = uploadedFile
        ? uploadedFile?.buffer
        : await getPdfBufferFromUrl(url);
      const { valid } = await verifyPdf({
        buffer: contractBuffer,
      });
      if (!valid) {
        next(ERRORS.COMMONLANDS_CONTRACT_IS_NOT_VALID);
      }
      // * Step 2: Verify each claimant's credential
      const { did } = await readContentOfPdf({
        buffer: contractBuffer,
      });
      const accessToken = await authenticationProgress();
      const didDocResponse = await getDidDocumentByDid({
        did: did,
        accessToken: accessToken,
      });
      if (!didDocResponse?.didDoc?.credentials) {
        next(ERRORS.NO_CREDENTIALS_FOUND);
      }
      const credentials = didDocResponse?.didDoc?.credentials;
      const promises = credentials.map((item) =>
        getAndVerifyCredential({
          credential: item,
          accessToken: accessToken,
        })
      );
      Promise.all(promises)
        .then(() => {
          logger.apiInfo(req, res, `Contract is verified!`);
          return res.status(200).json({
            isValid: true,
          });
        })
        .catch(() => {
          next(ERRORS.CONTRACT_IS_NOT_VALID);
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
      const accessToken = await authenticationProgress();
      const docContentResponse = await getDocumentContentByDid({
        did: did,
        accessToken: accessToken,
      });
      if (docContentResponse?.error_code) {
        next(ERRORS?.CANNOT_GET_DOCUMENT_INFORMATION);
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
  blockContract: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Block Commonlands Contract`);
      const { did } = req.body;
      const undefinedVar = checkUndefinedVar({
        did,
      });
      if (undefinedVar.undefined) {
        next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const { valid } = validateDID(did);
      if (!valid) {
        next(ERRORS.INVALID_DID);
      }
      const accessToken = await authenticationProgress();
      const didDocResponse = await getDidDocumentByDid({
        did: did,
        accessToken: accessToken,
      });
      if (didDocResponse?.error_code) {
        next(didDocResponse || ERRORS?.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      const didDoc = didDocResponse?.didDoc;
      const updateDidDoc = {
        ...didDoc,
        isBlocked: true,
      };
      const updatedDidDocResponse = await updateDocumentDid({
        did: did,
        accessToken: accessToken,
        didDoc: updateDidDoc,
      });
      if (updatedDidDocResponse?.error_code) {
        next(
          updatedDidDocResponse || ERRORS?.CANNOT_UPDATE_DOCUMENT_INFORMATION
        );
      }
      return res.status(200).json({
        message: `Blocked contract ${did} successfully!`,
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
  checkBlockContractStatus: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Check Block Commonlands Contract`);
      const { did } = req.body;
      const undefinedVar = checkUndefinedVar({
        did,
      });
      if (undefinedVar.undefined) {
        next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const { valid } = validateDID(did);
      if (!valid) {
        next(ERRORS.INVALID_DID);
      }
      const accessToken = await authenticationProgress();
      const didDocResponse = await getDidDocumentByDid({
        did: did,
        accessToken: accessToken,
      });
      if (didDocResponse?.error_code) {
        next(didDocResponse || ERRORS?.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      if (didDocResponse?.didDoc?.isBlocked) {
        return res.status(200).json({
          isBlocked: true,
        });
      }
      return res.status(200).json({
        isBlocked: false,
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
