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
} from "../../helpers/index.js";

axios.defaults.withCredentials = true;

export default {
  
};
