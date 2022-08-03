const axios = require("axios").default;
const { ERRORS, SERVERS, SCHEMAS } = require("../../core/constants");
const Logger = require("../../logger");
const {
  validateJSONSchema,
  getAddressFromHexEncoded,
  validateDIDSyntax,
  checkUndefinedVar,
  getFieldsFromItems,
} = require("../../core/index");

module.exports = {
  getDIDDocument: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { did } = req.headers;
    // Check missing paramters
    const undefinedVar = checkUndefinedVar({ did });
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });
    // Validate DID syntax
    const validDid = validateDIDSyntax(did, false),
      companyName = validDid.companyName,
      publicKey = validDid.fileNameOrPublicKey;
    if (!validDid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        detail: "Invalid DID syntax.",
      });

    // Call DID Controller
    // success:
    //   { ... }
    // error:
    //   { error_code: number, message: string }
    axios
      .get(SERVERS.DID_CONTROLLER + "/api/did/", {
        withCredentials: true,
        headers: {
          companyName: companyName,
          publicKey: publicKey,
          Cookie: `access_token=${access_token}`,
        },
      })
      .then((response) => {
        Logger.apiInfo(req, res, `Success.\n${response.data}`);
        return res.status(200).json(response.data);
      }) // 404
      .catch((error) => {
        Logger.apiError(req, res, `${error}`);
        return error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
  },

  createDIDDocument: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { did, didDocument } = req.body;

    // Check missing parameters
    const undefinedVar = checkUndefinedVar({ did, didDocument });
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });

    // Validate DID syntax
    const validDid = validateDIDSyntax(did, false),
      companyName = validDid.companyName,
      publicKey = validDid.fileNameOrPublicKey;
    if (!validDid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        detail: "Invalid DID syntax.",
      });

    // Call DID Controller
    // success:
    //   { message: string }
    // error:
    //   { error_code: number, message: string }
    axios
      .post(
        SERVERS.DID_CONTROLLER + "/api/did/",
        {
          companyName: companyName,
          publicKey: publicKey,
          content: didDocument,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      )
      .then((response) => {
        Logger.apiInfo(req, res, `Success.\n${response.data}`);
        response.data.error_code
          ? res.status(200).json(response.data)
          : res.status(201).send("DID Document created.");
      })
      .catch((error) => {
        Logger.apiError(req, res, `${error}`);
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
  },

  getWrappedDocument: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { did } = req.headers;
    const { only } = req.query;
    // Check missing parameters
    const undefinedVar = checkUndefinedVar({ did });
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });
    // Validate DID syntax
    const validDid = validateDIDSyntax(did, false),
      companyName = validDid.companyName,
      fileName = validDid.fileNameOrPublicKey;
    if (!validDid.valid) return res.status(200).json(ERRORS.INVALID_INPUT);
    // Call DID Controller
    // success:
    //   {
    //     didDoc: {},
    //     wrappedDoc: {}
    //   }
    // error:
    //   { error_code: number, message: string }
    axios
      .get(SERVERS.DID_CONTROLLER + "/api/doc", {
        withCredentials: true,
        headers: {
          companyName,
          fileName,
          Cookie: `access_token=${access_token}`,
        },
        params: { only },
      })
      .then((response) => {
        Logger.apiInfo(req, res, `Success.\n${response.data}`);
        return res.status(200).json(response.data);
      }) // 404
      .catch((error) => {
        Logger.apiError(req, res, `${error}`);
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
  },

  getAllWrappedDocumentsOfUser: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { did } = req.headers;

    // Handle input errors
    const undefinedVar = checkUndefinedVar({ did });
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });

    // Validate DID syntax
    const validDID = validateDIDSyntax(did, false),
      companyName = validDID.companyName,
      publicKey = validDID.fileNameOrPublicKey;
    if (!validDID.valid) return res.status(200).json(ERRORS.INVALID_INPUT);

    // Call DID Controller
    // success:
    //   [
    //     {...},
    //     {...}
    //   ]
    // error:
    //   { error_code: number, message: string }
    axios
      .get(SERVERS.DID_CONTROLLER + "/api/doc/user", {
        withCredentials: true,
        headers: {
          companyName: companyName,
          publicKey: publicKey,
          Cookie: `access_token=${access_token}`,
        },
      })
      .then((response) => {
        Logger.apiInfo(req, res, `Success.\n${response.data}`);
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        Logger.apiError(req, res, `${error}`);
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
  },

  checkWrappedDocumentExistence: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { companyname: companyName, filename: fileName } = req.headers;

    // Handle input errors
    const undefinedVar = checkUndefinedVar({ companyName, fileName });
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });

    // Call DID Contoller
    // success:
    //   { isExisted: true/false }
    axios
      .get(SERVERS.DID_CONTROLLER + "/api/doc/exists/", {
        withCredentials: true,
        headers: {
          companyName,
          fileName,
          Cookie: `access_token=${access_token}`,
        },
      })
      .then((response) => {
        Logger.apiInfo(req, res, `Success.\n${response.data}`);
        return res.status(200).json(response.data.isExisted);
      })
      .catch((error) => {
        Logger.apiError(req, res, `${error}`);
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
  },

  createWrappedDocument: async function (req, res) {
    // Get access-token from request and receive input data
    const { access_token } = req.cookies;
    let {
      wrappedDocument,
      issuerAddress: encryptedIssuerAddress,
      mintingNFTConfig,
    } = req.body;

    console.log(1);

    // Handle input errors
    const undefinedVar = checkUndefinedVar({
      wrappedDocument,
      encryptedIssuerAddress,
    });
    if (undefinedVar.undefined) {
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });
    }

    console.log(2);

    //Validate wrapped document format
    // const valid = validateJSONSchema(
    //   SCHEMAS.NEW_WRAPPED_DOCUMENT,
    //   wrappedDocument
    // );
    // if (!valid.valid)
    //   return res.status(200).json({
    //     ...ERRORS.INVALID_INPUT,
    //     error_message: "Bad request. Invalid wrapped document.",
    //     detail: valid.detail,
    //   });

    // Validate DID syntax
    const did = wrappedDocument.data.did,
      validDid = validateDIDSyntax(did, true),
      companyName = validDid.companyName,
      fileName = validDid.fileNameOrPublicKey;
    if (!validDid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        detail:
          "Invalid DID syntax. Check the wrappedDocument.data.did element.",
      });

    const issuerAddress = getAddressFromHexEncoded(encryptedIssuerAddress),
      targetHash = wrappedDocument.signature.targetHash;

    try {
      // 1. Validate permission to create document
      // 1.1. Get address of user from the acess token
      // success:
      //   { data: { address: string } }
      // error: 401 - unauthorized
      const address = await axios.get(
        SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: { Cookie: `access_token=${access_token};` },
        }
      );

      console.log(3);
      // 1.2 Compare issuer address with user address
      if (issuerAddress !== address.data.data.address) {
        Logger.apiError(
          req,
          res,
          `Address ${address.data.data.address} is not issuerAddress ${issuerAddress}`
        );
        return res.status(200).send(ERRORS.PERMISSION_DENIED); // 403
      }

      // 2. Check if document is already stored on DB (true/false).
      // success:
      //   { isExisted: true/false }
      const existence = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/doc/exists/",
        {
          withCredentials: true,
          headers: {
            companyName,
            fileName,
            Cookie: `access_token=${access_token};`,
          },
        }
      );
      if (existence.data.isExisted) {
        Logger.apiError(
          req,
          res,
          `Wrapped document with name ${fileName} already existed.`
        );
        return res.status(200).json(ERRORS.ALREADY_EXSISTED); // 409
      }

      // 3. Storing hash on Cardano blockchain
      // 3.1. Call Cardano Service
      // success:
      //   {
      //     data:
      //       {
      //         result: true,
      //         token: { policyId: string, assetId: string }
      //       }
      //   }
      // error:
      //   { error_code: number, error_message: string } }

      console.log(5);
      let mintBody = {
        hash: targetHash,
      };
      let mintingNFT;
      if (mintingNFTConfig) {
        mintBody = {
          newHash: targetHash,
          config: { ...mintingNFTConfig, burn: false },
        };
        mintingNFT = await axios.put(
          SERVERS.CARDANO_SERVICE + "/api/v2/hash/",
          mintBody,
          {
            withCredentials: true,
            headers: {
              Cookie: `access_token=${access_token};`,
            },
          }
        );
      } else {
        console.log("Create");
        mintingNFT = await axios.post(
          SERVERS.CARDANO_SERVICE + "/api/v2/hash/",
          mintBody,
          {
            withCredentials: true,
            headers: {
              Cookie: `access_token=${access_token};`,
            },
          }
        );
      }
      console.log("TUTU", mintingNFT);

      // 3.2. Handle store hash errors
      if (mintingNFT.data.code !== 0)
        return res.status(200).json(mintingNFT.data);
      if (!mintingNFT) return res.status(200).json(ERRORS.CANNOT_MINT_NFT);
      // 3.3. Extract policyId and assetId
      const _mintingNFTConfig = mintingNFT.data.data
        ? mintingNFT.data.data
        : false;
      console.log("TUTU2");
      // 4. Add policy Id and assert Id to wrapped document
      wrappedDocument = {
        ...wrappedDocument,
        mintingNFTConfig: _mintingNFTConfig,
      };
      console.log("TUTU3");
      // 5. Storing wrapped document on DB
      // Call DID Controller
      // success:
      //   { message: "success" }
      // error:
      //   { error_code: number, message: string }
      // ?? CHECK LAI CAI NAY
      const storeWrappedDocumentStatus = await axios.post(
        SERVERS.DID_CONTROLLER + "/api/doc",
        {
          fileName,
          wrappedDocument,
          companyName,
        },
        {
          withCredentials: true,
          headers: { Cookie: `access_token=${access_token};` },
        }
      );
      console.log("TUTU4", storeWrappedDocumentStatus);
      // 6. Return policyId an assetId if the process is success.
      storeWrappedDocumentStatus.data.error_code
        ? res.status(200).json(storeWrappedDocumentStatus.data)
        : res.status(201).json(wrappedDocument);
    } catch (err) {
      Logger.apiError(req, res, `${err}`);
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  },

  validateWrappedDocument: async function (req, res) {
    const { wrappedDocument } = req.body;
    const undefinedVar = checkUndefinedVar({ wrappedDocument });
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });

    const valid = validateJSONSchema(SCHEMAS.WRAPPED_DOCUMENT, wrappedDocument);

    return res.status(200).send(valid);
  },

  transferWrappedDocument: async function (req, res) {
    const { did, didDoc: didDocumentOfWrappedDocument } = req.body;
    const { access_token } = req.cookies;

    // Check missing parameters
    const undefinedVar = checkUndefinedVar({
      did,
      didDoc: didDocumentOfWrappedDocument,
    });
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });

    // Validate DID syntax
    const validDid = validateDIDSyntax(did, false),
      companyName = validDid.companyName,
      fileName = validDid.fileNameOrPublicKey;
    if (!validDid.valid) res.status(200).json(ERRORS.INVALID_INPUT);

    const valid = validateJSONSchema(
      SCHEMAS.DID_DOCUMENT_OF_WRAPPED_DOCUMENT,
      didDocumentOfWrappedDocument
    );
    if (!valid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        error_message: "Bad request. Invalid did document.",
        detail: valid.detail,
      });

    axios
      .put(SERVERS.DID_CONTROLLER + "/api/doc", {
        companyName: companyName,
        fileName: fileName,
        didDoc: didDocumentOfWrappedDocument,
      },  {
        // cancelToken: source.token,
        withCredentials: true,
        headers: {
          Cookie: `access_token=${access_token};`,
        },
      })
      .then((response) => res.status(200).json(response.data))
      .catch((error) => res.status(400).json(error));
  },

  revokeDocument: async function (req, res) {
    const { config } = req.body;
    console.log(req.body);
    const { access_token } = req.cookies;
    if (!config)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found: config",
      });
    try {
      const deleteDocumentResult = await axios.delete(
        SERVERS.CARDANO_SERVICE + "/api/v2/hash",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
          data: {
            config,
          },
        }
      );
      console.log("here", deleteDocumentResult.data);
      res.status(200).json(deleteDocumentResult.data);
    } catch (err) {
      console.log(err);
    }
  },

  searchWrappedDocument: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    let { companyName, searchString, pageNumber, itemsPerPage } = req.query;

    // Check missing paramters
    const undefinedVar = checkUndefinedVar({
      companyName,
      searchString,
    });
    if (undefinedVar.undefined)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: undefinedVar.detail,
      });

    pageNumber = pageNumber ? pageNumber : 1;
    itemsPerPage = itemsPerPage ? itemsPerPage : 5;

    try {
      // Call DID Controller
      // success:
      //   [
      //     {
      //       data:{ name: string, title: string, fileName: string, did: string, issuers: [] },
      //       signature: {},
      //       policyId: string,
      //       assetId: string
      //     }
      //   ]
      // error:
      //   { error_code: number, message: string }

      const wrappedDocuments = await axios.get(
        `${SERVERS.DID_CONTROLLER}/api/doc/search-content?companyName=${companyName}&searchString=${searchString}`,
        {
          withCredentials: true,
          Cookie: `access_token=${access_token};`,
        }
      );

      const _logWrappedDocuments = ((arrayOfItems) => {
        let fileNames = [];
        for (const item of arrayOfItems) fileNames.push(item.data.fileName);
        return fileNames;
      })(wrappedDocuments.data);

      const total = wrappedDocuments.data.length,
        maxPage =
          (total - (total % itemsPerPage)) / itemsPerPage +
          (total % itemsPerPage ? 1 : 0);

      pageNumber = pageNumber > maxPage ? maxPage : pageNumber;

      const startIndex = (pageNumber - 1) * itemsPerPage;
      let endIndex = parseInt(itemsPerPage) + parseInt(startIndex);
      endIndex = endIndex > total ? total : endIndex;

      const result = wrappedDocuments.data.slice(startIndex, endIndex),
        _logResult = _logWrappedDocuments.slice(startIndex, endIndex);

      Logger.apiInfo(
        req,
        res,
        `Page: ${pageNumber} of ${maxPage}.\nDisplay ${itemsPerPage} of ${total} results. From ${startIndex} to ${endIndex}.\n${JSON.stringify(
          _logResult
        )}`
      );

      return res.status(200).json({
        total,
        maxPage,
        currentPage: pageNumber,
        result,
      });
    } catch (err) {
      Logger.apiError(req, res, `${err}`);
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  },
};
