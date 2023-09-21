// * Constants
import { ERRORS, SERVERS } from "../../../config/constants.js";
import { COMMONLANDS } from "../../../config/schemas/index.js";

// * Utilities
import axios from "axios";
import { sha256 } from "js-sha256";
import "dotenv/config";
import {
  checkUndefinedVar,
  getCurrentDateTime,
  getPublicKeyFromAddress,
  generateRandomString,
  validateJSONSchema,
  validateDID,
} from "../../utils/index.js";
import {
  createDocumentForCommonlands,
  hashDocumentContent,
} from "../../utils/document.js";
import fs from "fs";
import FormData from "form-data";
import { getAccountBySeedPhrase } from "../../utils/lucid.js";
import { authenticationProgress } from "../../utils/auth.js";
import {
  getDocumentContentByDid,
  updateDocumentDid,
  getDidDocumentByDid,
} from "../../utils/controller.js";
import { createVerifiableCredential } from "../../utils/credential.js";
import {
  createOwnerCertificate,
  encryptPdf,
  getPdfBufferFromUrl,
  bufferToPDFDocument,
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
  createDocument: async (req, res, next) => {
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
        next({
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
          next(ERRORS?.CANNOT_FOUND_DID_DOCUMENT);
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
        next(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      const documentHash = wrappedDocument?.signature?.targetHash;
      logger.apiInfo(
        req,
        res,
        `Wrapped document ${JSON.stringify(wrappedDocument)}`
      );
      await createOwnerCertificate({
        fileName: pdfFileName,
        data: plotDetailForm,
      }).catch((error) => {
        next({
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
        next(uploadResponse?.data);
      }
      await deleteFile(`./assets/pdf/${pdfFileName}.pdf`);
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
  createPlotCertification: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Create Plot Certification`);
      const { plot } = req.body;
      const undefinedVar = checkUndefinedVar({
        plot,
      });
      if (undefinedVar.undefined) {
        next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const plotCertificationFileName = `PlotCertification-${plot?._id}`;
      const companyName = process.env.COMPANY_NAME;
      logger.apiInfo(req, res, `Pdf file name: ${plotCertificationFileName}`);
      const accessToken = await authenticationProgress();
      const isExistedResponse = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/doc/exists",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken}`,
          },
          params: {
            companyName: companyName,
            fileName: plotCertificationFileName,
          },
        }
      );
      if (isExistedResponse?.data?.isExisted) {
        logger.apiInfo(
          req,
          res,
          `Document ${plotCertificationFileName} existed`
        );
        const existedDidDoc = await getDidDocumentByDid({
          accessToken: accessToken,
          did: generateDid(companyName, plotCertificationFileName),
        });
        if (existedDidDoc?.data?.error_code) {
          return next(ERRORS?.CANNOT_FOUND_DID_DOCUMENT);
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
        fileName: plotCertificationFileName,
        name: `Land Certificate`,
        title: `Land-Certificate-${plot?.name}`,
        No: generateRandomString(plot._id, 7),
        dateIssue: getCurrentDateTime(),
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
        return next(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      const mintingConfig = wrappedDocument?.mintingNFTConfig;
      const documentHash = wrappedDocument?.signature?.targetHash;
      logger.apiInfo(
        req,
        res,
        `Wrapped document ${JSON.stringify(wrappedDocument)}`
      );
      const claimants = plot?.claimants;
      const promises = claimants.map(async (claimant) => {
        const { credential } = await createVerifiableCredential({
          metadata: claimant,
          did: documentDid,
          subject: {
            object: documentDid,
            action: {
              code: 1,
            },
          },
          signData: {
            key: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
            signature: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
          },
          issuerKey: documentDid,
        });
        const verifiedCredential = {
          ...credential,
          timestamp: Date.now(),
        };
        const credentialHash = sha256(
          Buffer.from(JSON.stringify(verifiedCredential), "utf8").toString(
            "hex"
          )
        );
        const credentialResponse = await axios.post(
          SERVERS.CARDANO_SERVICE + "/api/v2/credential",
          {
            config: mintingConfig,
            credential: credentialHash,
          },
          {
            withCredentials: true,
            headers: {
              Cookie: `access_token=${accessToken};`,
            },
          }
        );
        if (credentialResponse?.data?.code !== 0) {
          return next({
            ...ERRORS.CREDENTIAL_FAILED,
            detail: credentialResponse?.data,
          });
        }
        const storeCredentialStatus = await axios.post(
          SERVERS.DID_CONTROLLER + "/api/credential",
          {
            hash: credentialHash,
            content: {
              ...verifiedCredential,
              mintingNFTConfig: credentialResponse?.data?.data,
            },
          },
          {
            headers: {
              Cookie: `access_token=${accessToken};`,
            },
          }
        );
        if (storeCredentialStatus?.data?.error_code) {
          return next(storeCredentialStatus?.data);
        }
        return credentialHash;
      });
      Promise.all(promises)
        .then((data) => {
          return res.status(200).json({
            credentials: data,
            certificateDid: documentDid,
          });
        })
        .catch(() => {
          return next(ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT);
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
  revokeDocument: async (req, res, next) => {
    try {
      const { url, config } = req.body;
      if (!url && !config) {
        next(ERRORS?.MISSING_PARAMETERS);
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
        next(ERRORS?.REVOKE_DOCUMENT_FAILED);
      }
      logger.apiInfo(req, res, `Revoke document successfully!`);
      return res.status(200).json({
        revoked: true,
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
  hashDocument: async (req, res, next) => {
    try {
      const { plot, claimant } = req.body;
      const undefinedVar = checkUndefinedVar({
        plot,
        claimant,
      });
      if (undefinedVar.undefined) {
        next({
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
        ? next(error)
        : next({
            error_code: 400,
            message: error?.message || "Something went wrong!",
          });
    }
  },
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
