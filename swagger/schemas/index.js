import didDocument from "./didDocument.js";

import wrappedDocument from "../../core/schemas/wrappedDocument.js";
import newWrappedDocument from "../../core/schemas/newWrappedDocument.js";
import didDocumentOfWrappedDocument from "../../core/schemas/didDocumentOfWrappedDocument.js";

import credential from "../../core/schemas/credential.js";
import notification from "../../core/schemas/notification.js";
import { algorandConfig as algorandMintingNFTConfig } from "../../core/schemas/config.js";
import error from "./errorResponse.js";

const mintingNFTConfig = {};

export {
  didDocument,
  wrappedDocument,
  newWrappedDocument,
  didDocumentOfWrappedDocument,
  credential,
  notification,
  mintingNFTConfig,
  algorandMintingNFTConfig,
  error,
};

export default {
  didDocument,
  wrappedDocument,
  newWrappedDocument,
  didDocumentOfWrappedDocument,
  credential,
  notification,
  mintingNFTConfig,
  algorandMintingNFTConfig,
  error,
};
