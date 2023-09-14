// * Constants
import { ERRORS, SERVERS } from "../../../core/constants.js";
import { COMMONLANDS } from "../../../core/schemas/index.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import {
  checkUndefinedVar,
  getCurrentDateTime,
  getPublicKeyFromAddress,
  generateRandomString,
  validateJSONSchema,
  validateDID,
} from "../../../core/index.js";
import {
  createDocumentForCommonlands,
  hashDocumentContent,
} from "../../../core/document.js";
import fs from "fs";
import FormData from "form-data";
import { getAccountBySeedPhrase } from "../../../core/utils/lucid.js";
import { authenticationProgress } from "../../../core/utils/auth.js";
import {
  getDocumentContentByDid,
  updateDocumentDid,
  getDidDocumentByDid,
} from "../../../core/utils/controller.js";
import {
  createPdf,
  encryptPdf,
  getPdfBufferFromUrl,
  bufferToPDFDocument,
  deleteFile,
  createCommonlandsContract,
  verifyPdf,
  readContentOfPdf,
} from "../../../core/utils/pdf.js";
import { unsalt, deepUnsalt } from "../../../fuixlabs-documentor/utils/data.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import logger from "../../../logger.js";
import { getAndVerifyCredential } from "../../../core/utils/credential.js";

axios.defaults.withCredentials = true;

export default {
  createDocument: async (req, res) => {
    try {
      logger.apiInfo(
        req,
        res,
        `API Request: Create Document using Seed Phrase`
      );
      const { plot, owner, companyName: _companyName } = req.body;
      const currentRoute = req.path;
      const accessToken = await authenticationProgress();
      const undefinedVar = checkUndefinedVar({
        plot,
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
      const companyName = currentRoute.includes("testing")
        ? process.env.TESTING_COMPANY_NAME
        : process.env.COMPANY_NAME;
      const pdfFileName = `LandCertificate-${owner?.phoneNumber.replace(
        "+",
        ""
      )}-${plot?._id}`;
      logger.apiInfo(req, res, `Pdf file name: ${pdfFileName}`);
      const isExistedResponse = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/doc/exists",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken}`,
          },
          params: {
            companyName: companyName,
            fileName: pdfFileName,
          },
        }
      );
      logger.apiInfo(
        req,
        res,
        `Response from service: ${JSON.stringify(isExistedResponse?.data)}`
      );
      if (isExistedResponse?.data?.isExisted) {
        const existedDidDoc = await getDidDocumentByDid({
          accessToken: accessToken,
          did: generateDid(companyName, pdfFileName),
        });
        logger.apiInfo(
          req,
          res,
          `Response from service: ${JSON.stringify(existedDidDoc?.data)}`
        );
        if (existedDidDoc?.data?.error_code) {
          logger.apiError(req, res, `Error while getting DID document`);
          return res.status(200).json(ERRORS?.CANNOT_FOUND_DID_DOCUMENT);
        }
        logger.apiInfo(
          req,
          res,
          `Pdf url of existed document: ${existedDidDoc?.didDoc?.pdfUrl}`
        );
        return res.status(200).json({
          url: existedDidDoc?.didDoc?.pdfUrl,
          isExisted: true,
        });
      }
      let plotDetailForm = {
        profileImage: "sampleProfileImage",
        fileName: pdfFileName,
        name: `Land Certificate`,
        title: `Land-Certificate-${plot?.name}`,
        No: generateRandomString(plot._id, 7),
        dateIssue: getCurrentDateTime(),
        avatar: owner?.avatar,
        personalInformation: {
          claimant: owner?.fullName,
          right: owner?.role,
          phoneNumber: owner?.phoneNumber,
          claimrank: "okay",
          description:
            "Okay is the starting point. This level may have some boundaries unverified and may include one boundary dispute. If there is an ownership dispute of a plot but and one of the owners is part of a claimchain and the other’s has not completed a claimchain, the completed claimchain person will be listed as Okay. ",
        },
        plotInformation: {
          plotName: plot?.name,
          plotId: plot?.id,
          plot_Id: plot?._id,
          plotStatus: "Free & Clear",
          plotPeople: "Verified by 3 claimants, 6 Neighbors",
          plotLocation: plot?.placeName,
          plotCoordinates: plot?.centroid?.join(","),
          plotNeighbors: plot?.neighbors?.length,
          plotClaimants: plot?.claimants?.length,
          plotDisputes: plot?.disputes?.length,
          plotStatus: plot?.status,
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
      if (owner?.oldNumbers?.length > 0) {
        plotDetailForm = {
          ...plotDetailForm,
          oldNumbers: owner?.oldNumbers[owner?.oldNumbers?.length - 1],
        };
      }
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
        companyName: companyName,
      });
      const documentDid = generateDid(
        companyName,
        unsalt(wrappedDocument?.data?.fileName)
      );
      if (!documentDid) {
        return res.status(200).json(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      const documentHash = wrappedDocument?.signature?.targetHash;
      logger.apiInfo(
        req,
        res,
        `Wrapped document ${JSON.stringify(wrappedDocument)}`
      );
      await createPdf({
        fileName: pdfFileName,
        data: plotDetailForm,
      }).catch((error) => {
        logger.apiError(req, res, `Error while creating PDF`);
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
          filename: `${companyName}-${pdfFileName}.pdf`,
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
      if (uploadResponse?.data?.error_code) {
        logger.apiError(req, res, `Error while uploading PDF`);
        return res.status(200).json(uploadResponse);
      }
      await deleteFile(`./assets/pdf/${pdfFileName}.pdf`);
      const didResponse = await getDidDocumentByDid({
        did: documentDid,
        accessToken: accessToken,
      });
      if (!didResponse?.didDoc) {
        logger.apiError(req, res, `Error while getting DID document`);
        return res.status(200).json({
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
        logger.apiError(req, res, `Error while push url to DID document`);
        return res.status(200).json({
          error_code: 400,
          error_message: "Error while push url to DID document",
        });
      }
      logger.apiInfo(
        req,
        res,
        `Response from service: ${JSON.stringify(uploadResponse?.data)}`
      );
      return res.status(200).json(uploadResponse?.data);
    } catch (error) {
      error?.error_code
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            error_message: error?.message || "Something went wrong!",
          });
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
      logger.apiError(
        req,
        res,
        `Response from service: ${JSON.stringify(revokeResponse?.data)}`
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
            error_message: error?.message || "Something went wrong!",
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
            error_message: error?.message || "Something went wrong!",
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
          name: "Commonlands System LLC",
        },
        certificateByCEO: {
          name: "Darius Golkar",
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
            error_message: error?.message || "Something went wrong!",
          });
    }
  },
  createContract: async (req, res) => {
    try {
      logger.apiInfo(req, res, `API Request: Create Commonlands Contract`);
      const { content, companyName: _companyName, id } = req.body;
      const undefinedVar = checkUndefinedVar({
        content,
        id,
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
      const accessToken = await authenticationProgress();
      const companyName = _companyName || process.env.COMPANY_NAME;
      const valid = validateJSONSchema(
        COMMONLANDS?.COMMONLANDS_CONTRACT,
        content
      );
      if (!valid.valid)
        return res.status(200).json({
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
        logger.apiError(res, req, `Contract existed: ${contractFileName}`);
        return res.status(200).json(ERRORS?.DOCUMENT_IS_EXISTED);
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
        return res.status(200).json(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
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
        logger.apiError(req, res, `Error while creating PDF`);
        return res.status(200).json({
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
        logger.apiError(req, res, `Error while uploading PDF`);
        return res.status(200).json(uploadResponse);
      }
      await deleteFile(`./assets/pdf/${contractFileName}.pdf`);
      const didResponse = await getDidDocumentByDid({
        did: documentDid,
        accessToken: accessToken,
      });
      if (!didResponse?.didDoc) {
        logger.apiError(req, res, `Error while getting DID document`);
        return res.status(200).json({
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
        logger.apiError(req, res, `Error while push url to DID document`);
        return res.status(200).json({
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
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            error_message: error?.message || "Something went wrong!",
          });
    }
  },
  verifyContract: async (req, res) => {
    try {
      logger.apiInfo(req, res, `API Request: Verify Commonlands Contract`);
      const uploadedFile = req.file;
      const { url } = req.body;
      if (!url && !uploadedFile) {
        logger.apiError(
          req,
          res,
          "Error: Missing the way to get content of contract"
        );
        return res.status(200).json(ERRORS.MISSING_PARAMETERS);
      }
      // * Step 1: Verify the contract
      const contractBuffer = uploadedFile
        ? uploadedFile?.buffer
        : await getPdfBufferFromUrl(url);
      const { valid } = await verifyPdf({
        buffer: contractBuffer,
      });
      if (!valid) {
        logger.apiError(req, res, "Error: Contract is not valid!");
        return res.status(200).json(ERRORS.COMMONLANDS_CONTRACT_IS_NOT_VALID);
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
        logger.apiError(
          req,
          res,
          "There are no credentials related to this contract!"
        );
        return res.status(200).json({
          error_code: 400,
          error_message: "There are no credentials related to this contract!",
        });
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
          logger.apiError(req, res, `Error while verifying contract`);
          return res.status(200).json(ERRORS.CONTRACT_IS_NOT_VALID);
        });
    } catch (error) {
      error?.error_code
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            error_message: error?.message || "Something went wrong!",
          });
    }
  },
  getContract: async (req, res) => {
    try {
      const { did } = req.query;
      const undefinedVar = checkUndefinedVar({
        did,
      });
      if (undefinedVar.undefined) {
        logger.apiError(req, res, `Error: ${JSON.stringify(undefinedVar)}`);
        return res.status(200).json({
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
        logger.apiError(req, res, `Error while getting DID document`);
        return res.status(200).json(ERRORS?.CANNOT_GET_DOCUMENT_INFORMATION);
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
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            error_message: error?.message || "Something went wrong!",
          });
    }
  },
  blockContract: async (req, res) => {
    try {
      logger.apiInfo(req, res, `API Request: Block Commonlands Contract`);
      const { did } = req.body;
      const undefinedVar = checkUndefinedVar({
        did,
      });
      if (undefinedVar.undefined) {
        logger.apiError(req, res, `Error: ${JSON.stringify(undefinedVar)}`);
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const { valid } = validateDID(did);
      if (!valid) {
        logger.apiError(req, res, `Error: ${JSON.stringify(undefinedVar)}`);
        return res.status(200).json(ERRORS.INVALID_DID);
      }
      const accessToken = await authenticationProgress();
      const didDocResponse = await getDidDocumentByDid({
        did: did,
        accessToken: accessToken,
      });
      if (didDocResponse?.error_code) {
        logger.apiError(
          req,
          res,
          `Error while getting DID document, detail ${JSON.stringify(
            didDocResponse
          )}`
        );
        return res
          .status(200)
          .json(didDocResponse || ERRORS?.CANNOT_GET_DOCUMENT_INFORMATION);
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
        logger.apiError(
          req,
          res,
          `Error while updating DID document, detail ${JSON.stringify(
            updatedDidDocResponse
          )}`
        );
        return res
          .status(200)
          .json(
            updatedDidDocResponse || ERRORS?.CANNOT_UPDATE_DOCUMENT_INFORMATION
          );
      }
      return res.status(200).json({
        message: `Blocked contract ${did} successfully!`,
      });
    } catch (error) {
      error?.error_code
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            error_message: error?.message || "Something went wrong!",
          });
    }
  },
  checkBlockContractStatus: async (req, res) => {
    try {
      logger.apiInfo(req, res, `API Request: Check Block Commonlands Contract`);
      const { did } = req.body;
      const undefinedVar = checkUndefinedVar({
        did,
      });
      if (undefinedVar.undefined) {
        logger.apiError(req, res, `Error: ${JSON.stringify(undefinedVar)}`);
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const { valid } = validateDID(did);
      if (!valid) {
        logger.apiError(req, res, `Error: ${JSON.stringify(undefinedVar)}`);
        return res.status(200).json(ERRORS.INVALID_DID);
      }
      const accessToken = await authenticationProgress();
      const didDocResponse = await getDidDocumentByDid({
        did: did,
        accessToken: accessToken,
      });
      if (didDocResponse?.error_code) {
        logger.apiError(
          req,
          res,
          `Error while getting DID document, detail ${JSON.stringify(
            didDocResponse
          )}`
        );
        return res
          .status(200)
          .json(didDocResponse || ERRORS?.CANNOT_GET_DOCUMENT_INFORMATION);
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
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            error_message: error?.message || "Something went wrong!",
          });
    }
  },
};
