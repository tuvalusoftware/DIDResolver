// * Constants
import { SERVERS } from "../../config/constants.js";
import { ERRORS } from "../../config/errors/error.constants.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import { checkUndefinedVar, validateDID } from "../utils/index.js";
import { createVerifiableCredential } from "../utils/credential.js";
import {
  getDocumentContentByDid,
  getDidDocumentByDid,
  updateDocumentDid,
  getCredential,
} from "../utils/controller.js";
import logger from "../../../logger.js";
import { sha256 } from "js-sha256";
import { AuthHelper } from "../helpers/auth.js";

axios.defaults.withCredentials = true;

export default {
  createCredential: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Create credential`);
      const { metadata, did, subject, signData, issuerKey } = req.body;
      if (!did) {
        next({
          error_code: 400,
          error_message:
            "We need config or url to mint NFT! Make sure you have at least one of them!",
        });
      }
      const undefinedVar = checkUndefinedVar({
        metadata,
        subject,
        signData,
        issuerKey,
      });
      if (undefinedVar?.undefined) {
        next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const accessToken = await AuthHelper.authenticationProgress();
      let mintingConfig;
      if (did) {
        const { wrappedDoc } = await getDocumentContentByDid({
          did: did,
          accessToken: accessToken,
        });
        if (!wrappedDoc?.mintingNFTConfig) {
          next({
            error_code: 400,
            error_message: "This document is not minted yet!",
          });
        }
        mintingConfig = wrappedDoc?.mintingNFTConfig;
      }
      const { credential } = await createVerifiableCredential({
        signData,
        issuerKey,
        subject,
        metadata,
      });
      const verifiedCredential = {
        ...credential,
        timestamp: Date.now(),
      };
      const credentialResponse = await axios.post(
        SERVERS.CARDANO_SERVICE + "/api/v2/credential",
        {
          config: mintingConfig,
          credential: sha256(
            Buffer.from(JSON.stringify(verifiedCredential), "utf8").toString(
              "hex"
            )
          ),
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${accessToken};`,
          },
        }
      );
      if (credentialResponse?.data?.code !== 0) {
        next({
          ...ERRORS.CREDENTIAL_FAILED,
          detail: credentialResponse?.data,
        });
      }
      const storeCredentialStatus = await axios.post(
        SERVERS.DID_CONTROLLER + "/api/credential",
        {
          hash: sha256(
            Buffer.from(JSON.stringify(verifiedCredential), "utf8").toString(
              "hex"
            )
          ),
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
        next(storeCredentialStatus?.data);
      }
      const didResponse = await getDidDocumentByDid({
        accessToken: accessToken,
        did: did,
      });
      if (didResponse?.error_code) {
        next(didResponse);
      }
      const didUpdateResponse = await updateDocumentDid({
        did: did,
        accessToken: accessToken,
        didDoc: {
          ...didResponse?.didDoc,
          credentials: didResponse?.didDoc?.credentials
            ? [
                ...didResponse?.didDoc?.credentials,
                sha256(
                  Buffer.from(
                    JSON.stringify(verifiedCredential),
                    "utf8"
                  ).toString("hex")
                ),
              ]
            : [
                sha256(
                  Buffer.from(
                    JSON.stringify(verifiedCredential),
                    "utf8"
                  ).toString("hex")
                ),
              ],
        },
      });
      if (didUpdateResponse?.error_code) {
        next(didUpdateResponse);
      }
      logger.apiInfo(
        req,
        res,
        `Successfully saved: ${JSON.stringify(storeCredentialStatus.data)}`
      );
      return res.status(200).send(storeCredentialStatus.data);
    } catch (error) {
      error?.error_code
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            error_message: error?.error_message || "Something went wrong!",
          });
    }
  },
  getCredential: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Get credential`);
      const { credentialHash } = req.params;
      const undefinedVar = checkUndefinedVar({ credentialHash });
      if (undefinedVar?.undefined) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify(undefinedVar?.detail)}`
        );
        next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const accessToken = await AuthHelper.authenticationProgress();
      const credentialResponse = await getCredential({
        accessToken: accessToken,
        hash: credentialHash,
      });
      logger.apiInfo(
        req,
        res,
        `Successfully get credential. detail ${JSON.stringify(
          credentialResponse
        )}`
      );
      return res.status(200).json(credentialResponse);
    } catch (error) {
      error?.error_code
        ? next(error)
        : next({
            error_code: 400,
            error_message: error?.error_message || "Something went wrong!",
          });
    }
  },
  getCredentialsOfContract: async (req, res, next) => {
    try {
      logger.apiInfo(req, res, `API Request: Get all credentials of contract`);
      const { contractId } = req.params;
      const undefinedVar = checkUndefinedVar({ contractId });
      if (undefinedVar?.undefined) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify(undefinedVar?.detail)}`
        );
        next({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar?.detail,
        });
      }
      const { valid } = await validateDID(contractId);
      if (!valid) {
        next(ERRORS.INVALID_DID);
      }
      const accessToken = await AuthHelper.authenticationProgress();
      const didDocumentResponse = await getDidDocumentByDid({
        accessToken: accessToken,
        did: contractId,
      });
      if (didDocumentResponse?.error_code) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify(
            didDocumentResponse || ERRORS.CANNOT_GET_DOCUMENT_INFORMATION
          )}`
        );
        next(didDocumentResponse || ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      const credentials = didDocumentResponse?.didDoc?.credentials;
      if (!credentials || credentials.length === 0) {
        next(ERRORS.NO_CREDENTIALS_FOUND);
      }
      const promise = credentials.map(async (credential) => {
        const credentialResponse = await getCredential({
          accessToken: accessToken,
          hash: credential,
        });
        return {
          ...credentialResponse,
          hash: credential,
        };
      });
      await Promise.all(promise)
        .then((results) => {
          logger.apiInfo(
            req,
            res,
            `Successfully get all credentials of contract ${contractId}`
          );
          return res.status(200).json(results);
        })
        .catch((error) => {
          next(ERRORS.NO_CREDENTIALS_FOUND);
        });
    } catch (error) {
      error?.error_code
        ? res.status(200).json(error)
        : res.status(200).json({
            error_code: 400,
            error_message: error?.error_message || "Something went wrong!",
          });
    }
  },
};
