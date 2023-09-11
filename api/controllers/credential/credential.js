// * Constants
import { ERRORS, SERVERS } from "../../../core/constants.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import {
  checkUndefinedVar,
  getPublicKeyFromAddress,
} from "../../../core/index.js";
import { createVerifiableCredential } from "../../../core/utils/credential.js";
import { getAccountBySeedPhrase } from "../../../core/utils/lucid.js";
import {
  getDocumentContentByDid,
  getDidDocumentByDid,
  updateDocumentDid,
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
            message: "This document is not minted yet!",
          });
        }
        mintingConfig = wrappedDoc?.mintingNFTConfig;
      }
      const { credential } = await createVerifiableCredential({
        signData,
        issuerKey,
        subject,
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
      if (didUpdateResponse?.data?.error_code) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify(didUpdateResponse?.data)}`
        );
        return res.status(200).json(didUpdateResponse?.data);
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
            message: error?.message || "Something went wrong!",
          });
    }
  },
};
