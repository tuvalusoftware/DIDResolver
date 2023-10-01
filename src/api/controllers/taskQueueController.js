import { SERVERS } from "../../config/constants.js";
import { ERRORS } from "../../config/errors/error.constants.js";
import logger from "../../../logger.js";
import { checkUndefinedVar } from "../utils/index.js";
import axios from "axios";
import { AuthHelper } from "../../helpers/index.js";
import "dotenv/config";
import { unsalt } from "../../fuixlabs-documentor/utils/data.js";
import { getDidDocumentByDid, updateDocumentDid } from "../utils/controller.js";

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
      const mintingResponse = await axios.post(
        SERVERS.CARDANO_SERVICE + "/api/v2/hash/",
        {
          hash: wrappedDocument?.signature?.targetHash,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken};`,
          },
        }
      );
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
      const storeWrappedDocumentStatus = await axios.post(
        SERVERS.DID_CONTROLLER + "/api/doc",
        {
          fileName,
          wrappedDocument: willWrappedDocument,
          companyName,
        },
        {
          withCredentials: true,
          headers: { Cookie: `access_token=${accessToken};` },
        }
      );
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
};
