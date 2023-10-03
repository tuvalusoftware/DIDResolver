import { REQUEST_TYPE } from "../../config/constants.js";
import { ERRORS } from "../../config/errors/error.constants.js";
import logger from "../../../logger.js";
import { checkUndefinedVar } from "../utils/index.js";
import {
  AuthHelper,
  TaskQueueHelper,
  ControllerHelper,
} from "../../helpers/index.js";
import "dotenv/config";
import { unsalt } from "../../fuixlabs-documentor/utils/data.js";
import { getDidDocumentByDid, updateDocumentDid } from "../utils/controller.js";
import { createVerifiableCredential } from "../utils/credential.js";
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import { sha256 } from "js-sha256";
import { CardanoHelper } from "../../helpers/index.js";

export default {
  revokeDocument: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, "Request API: Request revoke document!");
      const { mintingConfig } = req.body;
      const undefinedVar = checkUndefinedVar({ mintingConfig });
      if (undefinedVar.undefined) {
        return next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      }
      const accessToken = await AuthHelper.authenticationProgress();
      const revokeResponse = await CardanoHelper.burnNft({
        mintingConfig,
        accessToken,
      });
      logger.apiError(
        req,
        res,
        `Response from service: ${JSON.stringify(revokeResponse?.data)}`
      );
      if (revokeResponse?.data?.code !== 0) {
        return next(ERRORS?.REVOKE_DOCUMENT_FAILED);
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
            error_message:
              error?.error_message || error?.message || "Something went wrong!",
          });
    }
  },
  createDocument: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, "Request API: Request create document!");
      const { wrappedDocument, companyName, url, did } = req.body;
      const undefinedVar = checkUndefinedVar({
        wrappedDocument,
        companyName,
        url,
        did,
      });
      if (undefinedVar.undefined) {
        return next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      }
      const accessToken = await AuthHelper.authenticationProgress();
      const mintingResponse = await CardanoHelper.storeToken({
        hash: wrappedDocument?.signature?.targetHash,
        accessToken,
      });
      if (mintingResponse?.data?.code !== 0) {
        throw {
          ...ERRORS.CANNOT_MINT_NFT,
          detail: mintingResponse?.data,
        };
      }
      const mintingConfig = mintingResponse?.data?.data;
      logger.apiInfo(
        req,
        res,
        `Minting config: ${JSON.stringify(mintingConfig)}`
      );
      const willWrappedDocument = {
        ...wrappedDocument,
        mintingConfig,
      };
      const fileName = unsalt(willWrappedDocument?.data?.fileName);
      logger.apiInfo(req, res, `File name: ${fileName}`);
      const storeWrappedDocumentStatus = await ControllerHelper.storeDocument({
        accessToken,
        companyName,
        fileName,
        wrappedDocument: willWrappedDocument,
      });
      if (storeWrappedDocumentStatus?.data?.error_code) {
        return next(
          storeWrappedDocumentStatus?.data || ERRORS.CANNOT_STORE_DOCUMENT
        );
      }
      logger.apiInfo(
        req,
        res,
        `Wrapped document ${JSON.stringify(willWrappedDocument)}`
      );
      const didResponse = await getDidDocumentByDid({
        did: did,
        accessToken: accessToken,
      });
      if (!didResponse?.didDoc) {
        return next(ERRORS.CANNOT_GET_DID_DOCUMENT);
      }
      const updateDidDoc = {
        ...didResponse?.didDoc,
        pdfUrl: url,
      };
      const updateDidDocResponse = await updateDocumentDid({
        did: did,
        accessToken: accessToken,
        didDoc: updateDidDoc,
      });
      if (updateDidDocResponse?.error_code) {
        return next(ERRORS.ERROR_PUSH_URL_TO_DID_DOCUMENT);
      }
      return res.status(200).json({ url: url, did: did });
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
  createPlotDocument: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, "Request API: Request create plot document!");
      const { wrappedDocument, plot, did, companyName } = req.body;
      const undefinedVar = checkUndefinedVar({ wrappedDocument, plot, did });
      if (undefinedVar.undefined) {
        return next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      }
      const documentHash = wrappedDocument?.signature?.targetHash;
      logger.apiInfo(
        req,
        res,
        `Wrapped document ${JSON.stringify(wrappedDocument)}`
      );
      const accessToken = await AuthHelper.authenticationProgress();
      const mintingResponse = await CardanoHelper.storeToken({
        hash: wrappedDocument?.signature?.targetHash,
        accessToken,
      });
      if (mintingResponse?.data?.code !== 0) {
        throw {
          ...ERRORS.CANNOT_MINT_NFT,
          detail: mintingResponse?.data,
        };
      }
      const mintingConfig = mintingResponse?.data?.data;
      const willWrappedDocument = {
        ...wrappedDocument,
        mintingConfig,
      };
      const fileName = unsalt(willWrappedDocument?.data?.fileName);
      logger.apiInfo(req, res, `File name: ${fileName}`);
      const storeWrappedDocumentStatus = await ControllerHelper.storeDocument({
        accessToken,
        companyName,
        fileName,
        wrappedDocument: willWrappedDocument,
      });
      if (storeWrappedDocumentStatus?.data?.error_code) {
        return next(
          storeWrappedDocumentStatus?.data || ERRORS.CANNOT_STORE_DOCUMENT
        );
      }
      const claimants = plot?.claimants;
      const promises = claimants.map(async (claimant) => {
        const { credential } = await createVerifiableCredential({
          metadata: claimant,
          did: did,
          subject: {
            action: {
              code: 1,
              proofHash: documentHash,
            },
          },
          signData: {
            key: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
            signature: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
          },
          issuerKey: did,
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
        const taskQueueResponse = await TaskQueueHelper.sendMintingRequest({
          data: {
            mintingConfig,
            credential: credentialHash,
            verifiedCredential,
          },
          type: REQUEST_TYPE.MINT_CREDENTIAL,
          did: generateDid(companyName, credentialHash),
        });
        return taskQueueResponse?.data;
      });
      Promise.all(promises)
        .then((data) => {
          return res.status(200).json({
            credentials: data,
            certificateDid: did,
          });
        })
        .catch((error) => {
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
  createClaimantCredential: async (req, res, next) => {
    try {
      logger.apiInfo(
        req,
        res,
        "Request API: Request create claimant credential!"
      );
      const { mintingConfig, credentialHash, verifiedCredential } = req.body;
      const undefinedVar = checkUndefinedVar({
        mintingConfig,
        credentialHash,
        verifiedCredential,
      });
      if (undefinedVar.undefined) {
        return next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      }
      const accessToken = await AuthHelper.authenticationProgress();
      const credentialResponse = await CardanoHelper.storeCredentials({
        mintingConfig,
        credentialHash: credentialHash,
        accessToken,
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
        accessToken,
      });
      if (storeCredentialStatus?.data?.error_code) {
        return next(storeCredentialStatus?.data);
      }
      return res.status(200).json({
        credentialHash,
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
};
