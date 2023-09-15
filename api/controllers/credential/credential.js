// * Constants
import { ERRORS, SERVERS } from "../../../core/constants.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import { checkUndefinedVar, validateDID } from "../../../core/index.js";
import { createVerifiableCredential } from "../../../core/utils/credential.js";
import {
  getDocumentContentByDid,
  getDidDocumentByDid,
  updateDocumentDid,
  getCredential,
} from "../../../core/utils/controller.js";
import { authenticationProgress } from "../../../core/utils/auth.js";
import logger from "../../../logger.js";
import { sha256 } from "js-sha256";

axios.defaults.withCredentials = true;

export default {
  createCredential: async (req, res) => {
    try {
      const { metadata, did, subject, signData, issuerKey } = req.body;
      if (!did) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify({
            ...ERRORS.MISSING_PARAMETERS,
            detail: "Missing config, did or url",
          })}`
        );
        return res.status(200).json({
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
      let mintingConfig;
      if (did) {
        const { wrappedDoc } = await getDocumentContentByDid({
          did: did,
          accessToken: accessToken,
        });
        if (!wrappedDoc?.mintingNFTConfig) {
          return res.status(200).json({
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
        return res.status(200).json({
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
        return res.status(200).json(storeCredentialStatus?.data);
      }
      const didResponse = await getDidDocumentByDid({
        accessToken: accessToken,
        did: did,
      });
      if (didResponse?.error_code) {
        logger.apiError(req, res, `Error: ${JSON.stringify(didResponse)}`);
        return res.status(200).json(didResponse);
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
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify(didUpdateResponse?.data)}`
        );
        return res.status(200).json(didUpdateResponse);
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
  getCredentialsOfContract: async (req, res) => {
    try {
      logger.apiInfo(req, res, `Get all credentials of contract`);
      const { contractId } = req.params;
      console.log(contractId);
      const undefinedVar = checkUndefinedVar({ contractId });
      if (undefinedVar?.undefined) {
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
      const { valid } = await validateDID(contractId);
      if (!valid) {
        return res.status(200).json(ERRORS.INVALID_DID);
      }
      const accessToken = await authenticationProgress();
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
        return res
          .status(200)
          .json(didDocumentResponse || ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
      }
      const credentials = didDocumentResponse?.didDoc?.credentials;
      if (!credentials || credentials.length === 0) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify(ERRORS.NO_CREDENTIALS_FOUND)}`
        );
      }
      const promise = credentials.map(async (credential) => {
        const credentialResponse = await getCredential({
          accessToken: accessToken,
          hash: credential,
        });
        return {
          ...credentialResponse?.data,
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
          logger.apiError(req, res, `Error: ${JSON.stringify(error)}`);
          return res.status(200).json(ERRORS.NO_CREDENTIALS_FOUND);
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
