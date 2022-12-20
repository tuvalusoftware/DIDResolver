const axios = require("axios").default;
const { ERRORS, SERVERS, SCHEMAS } = require("../../../core/constants");
const Logger = require("../../../logger");
const {
  validateJSONSchema,
  getAddressFromHexEncoded,
  validateDIDSyntax,
  checkUndefinedVar,
} = require("../../../core/index");

axios.defaults.withCredentials = true;

module.exports = {
  createWrappedDocument: async function (req, res) {
    const { access_token } = req.cookies;
    let { wrappedDocument, issuerAddress } = req.body;
    try {
      const undefinedVar = checkUndefinedVar({
        wrappedDocument,
        issuerAddress,
      });
      if (undefinedVar.undefined) {
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      }
      const did = wrappedDocument.data?.did,
        validDid = validateDIDSyntax(did, true),
        companyName = validDid.companyName,
        fileName = validDid.fileNameOrPublicKey;

      if (!validDid.valid)
        return res.status(200).json({
          ...ERRORS.INVALID_INPUT,
          detail: "Invalid DID syntax. Check did element.",
        });

      const targetHash = wrappedDocument?.signature?.targetHash;
      const address = await axios.get(
        SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
        }
      );
      Logger.apiInfo(
        req,
        res,
        `Address of user: ${address?.data?.data?.address}`
      );
      if (issuerAddress !== address?.data?.data?.address) {
        Logger.apiError(
          req,
          res,
          `Address ${address?.data?.data?.address} is not issuer ${issuerAddress}`
        );
        return res.status(200).send(ERRORS.PERMISSION_DENIED);
      }
      Logger.apiInfo(
        req,
        res,
        `Issuer address matches current address. Address: ${issuerAddress}`
      );
      const isExistence = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/doc/exists",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
          params: {
            companyName,
            fileName,
          },
        }
      );
      if (isExistence && isExistence?.data && isExistence?.data?.isExisted) {
        Logger.apiError(
          req,
          res,
          `Wrapped document with name ${fileName} already existed.`
        );
        return res.status(200).json(ERRORS.ALREADY_EXSISTED);
      }
      Logger.apiInfo(
        req,
        res,
        `Confirm new wrapped document. Continue creating...`
      );
      const createDocumentResponse = await axios.post(
        SERVERS.ALGORAND_SERVICE + "/api/v1/hash",
        {
          hash: targetHash,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      );
      if (!createDocumentResponse || !createDocumentResponse?.data) {
        return res.status(200).json(ERRORS.CANNOT_MINT_NFT);
      }
      if (
        createDocumentResponse &&
        createDocumentResponse.data &&
        createDocumentResponse.data.code !== 0
      ) {
        Logger.apiError(
          req,
          res,
          `${JSON.stringify(createDocumentResponse.data)}`
        );
        return res.status(200).json({
          ...ERRORS.CANNOT_MINT_NFT,
          detail: createDocumentResponse.data,
        });
      }
      Logger.apiInfo(
        req,
        res,
        `Minting NFT.\n${JSON.stringify(createDocumentResponse.data)}`
      );
      const mintingNFTConfig = createDocumentResponse?.data?.data;
      wrappedDocument = {
        ...wrappedDocument,
        mintingNFTConfig,
      };
      const storeDocumentResponse = await axios.post(
        SERVERS.DID_CONTROLLER + "/api/doc",
        {
          fileName,
          wrappedDocument,
          companyName,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      );
      if (storeDocumentResponse?.data?.error_code) {
        Logger.apiError(
          req,
          res,
          `${JSON.stringify(storeDocumentResponse.data)}`
        );
        return res.status(200).json(storeDocumentResponse.data);
      }
      Logger.apiInfo(
        req,
        res,
        `Success.\n${JSON.stringify(storeDocumentResponse.data)}`
      );
      return res.status(201).json(wrappedDocument);
    } catch (error) {
      Logger.apiError(req, res, `${JSON.stringify(error)}`);
      return error.response
        ? res.status(400).json(error?.response?.data)
        : res.status(400).json(error);
    }
  },
  validateDocument: async function (req, res) {
    const { access_token } = req.cookies;

    try {
    } catch (e) {
      Logger.apiError(req, res, `${JSON.stringify(e)}`);
      return e.response
        ? res.status(200).json(e.response)
        : res.status(200).json(e);
    }
  },
  revokeDocument: async function (req, res) {
    try {
      const accessToken = req.cookies["access_token"];
      const { config } = req.body;
      const undefinedVar = checkUndefinedVar({
        config,
      });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const revokeResponse = await axios.delete(
        SERVERS.ALGORAND_SERVICE + "/api/v1/hash",
        {
          withCredentials: true,
          headers: {
            cookie: `access_token=${accessToken}`,
          },
          data: {
            config,
          },
        }
      );
      revokeResponse && revokeResponse.data && revokeResponse.data.code !== 0
        ? Logger.apiError(req, res, `${JSON.stringify(revokeResponse.data)}`)
        : Logger.apiInfo(
            req,
            res,
            `Success.\n${JSON.stringify(revokeResponse.data)}`
          );

      return res.status(200).json(revokeResponse.data);
    } catch (e) {
      Logger.apiError(req, res, `${JSON.stringify(e)}`);
      return e.response
        ? res.status(400).json(e.response)
        : res.status(400).json(e);
    }
  },
};
