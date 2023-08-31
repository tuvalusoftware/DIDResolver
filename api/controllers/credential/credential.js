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
import { createVerifiableCredential } from "../../../core/utils/credential.js";
import { getAccountBySeedPhrase } from "../../../core/utils/lucid.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import { getDocumentContentByDid } from "../../../core/utils/controller.js";
import { authenticationProgress } from "../../../core/utils/auth.js";
import {
  getPdfBufferFromUrl,
  bufferToPDFDocument,
} from "../../../core/utils/pdf.js";
import logger from "../../../logger.js";
import { sha256 } from "js-sha256";

axios.defaults.withCredentials = true;

export default {
  createCredential: async (req, res) => {
    try {
      const { metadata, seedPhrase, config, url } = req.body;
      if (!config && !url) {
        logger.apiError(
          req,
          res,
          `Error: ${JSON.stringify({
            ...ERRORS.MISSING_PARAMETERS,
            detail: "Missing config or url",
          })}`
        );
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: "Missing config or url",
        });
      }
      const undefinedVar = checkUndefinedVar({
        metadata,
        seedPhrase,
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

      let mintingConfig = config;
      let didDocument;
      if (url) {
        const pdfDocBuffer = await getPdfBufferFromUrl(url);
        const pdfDoc = await bufferToPDFDocument(pdfDocBuffer);
        const keywords = pdfDoc.getKeywords();
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
        if (!wrappedDoc?.mintingNFTConfig) {
          return res.status(200).json({
            error_code: 400,
            message: "This document is not minted yet!",
          });
        }
        didDocument = did;
        mintingConfig = wrappedDoc?.mintingNFTConfig;
      }
      const { currentWallet, lucidClient } = await getAccountBySeedPhrase({
        seedPhrase: seedPhrase,
      });
      const publicKey = getPublicKeyFromAddress(currentWallet?.paymentAddr);
      let dids = {
        issuerKey: generateDid(process.env.COMPANY_NAME, publicKey),
      };
      const props = {
        didoWrappedDocument: didDocument,
        metadata,
        action: {
          code: 1,
        },
      };
      const { credential } = await createVerifiableCredential(
        props,
        publicKey,
        lucidClient,
        currentWallet
      );
      const verifiedCredential = {
        ...credential,
        timestamp: Date.now(),
      };
      const credentialResponse = await axios.post(
        SERVERS.CARDANO_SERVICE + "/api/v2/credential",
        {
          config: mintingConfig,
          credential: sha256(
            Buffer.from(JSON.stringify(credential), "utf8").toString("hex")
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
            Buffer.from(JSON.stringify(credential), "utf8").toString("hex")
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
