const axios = require("axios").default;
const { ERRORS, SERVERS, SHEMAS } = require("../../core/constants");
const { validateJSONSchema, getAddressFromHexEncoded } = require("../../core/index");

module.exports = {
  getDIDDocument: async function (req, res) {
    // Receive input data
    const access_token = req.cookies['access_token'];
    const { did } = req.headers;

    // Handle input errors
    if (!did) return res.status(200).json({
      ...ERRORS.MISSING_PARAMETERS,
      detail: "Not found: did"
    });

    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did")
      return res.status(200).json(ERRORS.INVALID_INPUT);

    // Extract data required to call services
    const companyName = didComponents[2],
      fileName = didComponents[3];

    // Authenticate
    // success:
    //   { data: { address: string } }
    // error: 401 - unauthorized
    axios
      .get(SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        })
      .then((response) => console.log("createCredential..."))
      .catch((error) => console.log("UNAUTHORIZED"));

    // Call DID Controller
    // success:
    //   { ... }
    // error:
    //   { errorCode: number, message: string }
    axios
      .get(SERVERS.DID_CONTROLLER + "/api/did/",
        {
          headers: {
            companyName: companyName,
            publicKey: fileName,
          },
        })
      .then((response) =>
        response.data.errorCode
          ? res.status(200).json(response.data) // 404
          : res.status(200).json(response.data))
      .catch((error) =>
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error)
      );
  },

  createDIDDocument: async function (req, res) {
    // Receive input data
    const access_token = req.cookies['access_token'];
    const { did, didDocument } = req.body;

    // Handle input errors
    if (!did || !didDocument)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found:"
          + (!did) ? " did" : ""
            + (!didDocument) ? " didDocument" : ""
      })

    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did")
      return res.status(200).json(ERRORS.INVALID_INPUT);

    // Extract data required to call services
    const companyName = didComponents[2],
      fileName = didComponents[3];

    // Authenticate
    // success:
    //   { data: { address: string } }
    // error: 401 - unauthorized
    axios
      .get(SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        })
      .then((response) => console.log("createCredential..."))
      .catch((error) => console.log("UNAUTHORIZED"));

    // Call DID Controller
    // success: 
    //   { message: string }
    // error: 
    //   { errorCode: number, message: string }
    axios.post(SERVERS.DID_CONTROLLER + "/api/did/",
      {
        companyName: companyName,
        publicKey: fileName,
        content: didDocument,
      })
      .then((response) => {
        console.log(response.data);
        response.data.errorCode
          ? res.status(200).json(response.data)
          : res.status(201).send("DID Document created.")
      })
      .catch((error) => {
        console.log(error);
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error)
      });
  },

  getWrappedDocument: async function (req, res) {
    // Receive input data
    const access_token = req.cookies['access_token'];
    const { did } = req.headers;
    const { only } = req.query;

    // Handle input errors
    if (!did)
      return res.status(400).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found: did"
      });

    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did")
      return res.status(400).json(ERRORS.INVALID_INPUT);

    // Authenticate
    // success:
    //   { data: { address: string } }
    // error: 401 - unauthorized
    axios
      .get(SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        })
      .then((response) => console.log("createCredential..."))
      .catch((error) => console.log("UNAUTHORIZED"));

    // Call DID Controller
    // success:
    //   {
    //     didDoc: {},
    //     wrappedDoc: {}
    //   }
    // error: 
    //   { errorCode: number, message: string }
    axios
      .get(SERVERS.DID_CONTROLLER + "/api/doc", {
        headers: {
          companyName: didComponents[2],
          fileName: didComponents[3]
        },
        params: { only }
      })
      .then((response) => {
        response.data.errorCode
          ? res.status(200).json(response.data) // 404
          : res.status(200).json(response.data);
      })
      .catch((error) => {
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error)
      });
  },

  getAllWrappedDocumentsOfUser: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies["access_token"];
    const { did } = req.headers;

    // Handle input errors
    if (!did)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found: did"
      });

    // did syntax: did:method:companyName:(uuid4:string:address)
    const didComponents = did.split(":");
    if (didComponents.length < 6 || didComponents[0] != "did")
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        detail: "DID syntax: did:method:companyName:(uuid4:string:address)"
      });

    // Extract data required to call service
    const companyName = didComponents[2];
    const publicKey = didComponents.slice(3).join(":");
    // console.log("Company name", companyName);
    // console.log("Public key", publicKey);

    // Authenticate
    // success:
    //   { data: { address: string } }
    // error: 401 - unauthorized
    axios
      .get(SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        })
      .then((response) => console.log("createCredential..."))
      .catch((error) => console.log("UNAUTHORIZED"));

    // Call DID Controller
    // success:
    //   [
    //     {...},
    //     {...}
    //   ]
    // error: 
    //   { errorCode: number, message: string }
    axios
      .get(SERVERS.DID_CONTROLLER + "/api/doc/user", {
        headers: {
          companyName: companyName,
          publicKey: publicKey
        },
      })
      .then((response) => {
        response.data.errorCode
          ? res.status(200).json(response.data)
          : res.status(200).json(response.data);
      })
      .catch((error) => {
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error)
      });
  },

  checkWrappedDocumentExistence: async function (req, res) {
    // Receive input data
    const { companyname: companyName, filename: fileName } = req.headers;
    console.log(companyName, fileName);

    // Handle input errors
    if (!companyName || !fileName)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found: "
          + (!companyName) ? " companyName" : ""
            + (!fileName) ? " fileName" : ""
      });

    // Authenticate
    // success:
    //   { data: { address: string } }
    // error: 401 - unauthorized
    axios
      .get(SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        })
      .then((response) => console.log("createCredential..."))
      .catch((error) => console.log("UNAUTHORIZED"));

    // Call DID Contoller
    // success:
    //   { isExisted: true/false }
    axios
      .get(SERVERS.DID_CONTROLLER + "/api/doc/exists/",
        {
          headers: {
            companyName,
            fileName,
          },
        })
      .then((response) => res.status(200).json(response.data.isExisted))
      .catch((error) =>
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error)
      );
  },

  createWrappedDocument: async function (req, res) {
    // Get access-token from request and receive input data
    const access_token = req.cookies['access_token'];
    var { wrappedDocument, issuerAddress: encryptedIssuerAddress } = req.body;

    // Handle input errors
    if (!wrappedDocument || !encryptedIssuerAddress) {
      return res.status(400).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found:"
          + (!wrappedDocument) ? " wrappedDocument" : ""
            + (!encryptedIssuerAddress) ? " issuerAddress" : ""
      });
    }

    //Validate wrapped document format
    const valid = validateJSONSchema(SHEMAS.NEW_WRAPPED_DOCUMENT, wrappedDocument);
    if (!valid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        errorMessage: "Bad request. Invalid wrapped document.",
        detail: valid.detail
      });

    // Extract data required to call services
    const did = wrappedDocument.data.did;
    const targetHash = wrappedDocument.signature.targetHash;

    const didComponents = did.split(":");
    if (didComponents.length < 6 || didComponents[2] !== "did") {
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        detail: "Invalid DID syntax. Check the wrappedDocument.data.did element."
      });
    }

    const companyName = didComponents[4],
      fileName = didComponents[5],
      issuerAddress = getAddressFromHexEncoded(encryptedIssuerAddress);

    try {
      // 1. Validate permission to create document
      // 1.1. Get address of user from the acess token
      // success: 
      //   { data: { address: string } }
      // error: 401 - unauthorized
      const address = await axios.get(SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        });
      // 1.2 Compare issuer address with user address
      if (issuerAddress !== address.data.data.address)
        return res.status(403).send(ERRORS.PERMISSION_DENIED);

      // 2. Check if document is already stored on DB (true/false).
      // success: 
      //   { isExisted: true/false }
      const existence = await axios.get(SERVERS.DID_CONTROLLER + "/api/doc/exists/",
        {
          headers: {
            companyName,
            fileName,
          },
        });
      if (existence.data.isExisted) {
        return res.status(409).json(ERRORS.ALREADY_EXSISTED);
      }
      // console.log(1, access_token)

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
      const mintingNFT = await axios.put(SERVERS.CARDANO_SERVICE + "/api/storeHash/",
        {
          address: issuerAddress,
          hashOfDocument: targetHash,
          previousHashOfDocument: previousHashOfDocument || "EMPTY",
          originPolicyId: originPolicyId || "EMPTY"
        },
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        });

      // 3.2. Handle store hash errors 
      if (mintingNFT.data.error_code)
        return res.status(400).json(mintingNFT.data);
      if (!mintingNFT) return res.status(400).json(ERRORS.CANNOT_MINT_NFT);

      // 3.3. Extract policyId and assetId
      const mintingNFTStatus = (mintingNFT.data.data.result) ? mintingNFT.data.data.result : false;
      const policyId = mintingNFTStatus ? mintingNFT.data.data.token.policyId : "No policyId";
      const assetId = mintingNFTStatus ? mintingNFT.data.data.token.assetId : "No assetId";

      // 4. Add policy Id and assert Id to wrapped document
      wrappedDocument = { ...wrappedDocument, policyId: policyId, assetId: assetId }

      // 5. Storing wrapped document on DB
      // Call DID Controller 
      // success:
      //   { message: "success" }
      // error:
      //   { errorCode: number, message: string }
      const storeWrappedDocumentStatus = await axios.post((SERVERS.DID_CONTROLLER + "/api/doc"),
        {
          fileName,
          wrappedDocument,
          companyName,
        }
      );

      // 6. Return policyId an assetId if the process is success.
      storeWrappedDocumentStatus.data.errorCode
        ? res.status(200).json(storeWrappedDocumentStatus.data)
        : res.status(201).json(wrappedDocument);
    }
    catch (err) {
      console.log("CATCH ERROR");
      console.log(err);
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  },

  validateWrappedDocument: async function (req, res) {
    const { wrappedDocument } = req.body;
    if (!wrappedDocument)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found: wrappedDocument"
      });

    const valid = validateJSONSchema(SHEMAS.WRAPPED_DOCUMENT, wrappedDocument);

    return res.status(200).send(valid);
  },

  updateWrappedDocument: async function (req, res) {
    // Receive input data
    const access_token = req.cookies["access_token"];
    var { didDocumentOfWrappedDocument, did } = req.body;

    // Handle input errors
    if (!didDocumentOfWrappedDocument || !did)
      return res.status(400).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found:"
          + (!didDocumentOfWrappedDocument) ? " didDocumentOfWrappedDocument" : ""
            + (!did) ? " did" : ""
      });

    // Validate wrapped document format
    const valid = validateJSONSchema(SHEMAS.DID_DOCUMENT_OF_WRAPPED_DOCUMENT, didDocumentOfWrappedDocument);
    if (!valid.valid)
      return res.status(400).json({
        ...ERRORS.INVALID_INPUT,
        errorMessage: "Bad request. Invalid did document of wrapped document.",
        detail: valid.detail
      });

    // Extract data required to call services
    didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did")
      return res.status(400).json({
        ...ERRORS.INVALID_INPUT,
        detail: "Invalid DID syntax."
      });

    const companyName = didComponents[2],
      fileName = didComponents[3],
      controllerAddress = getAddressFromHexEncoded(encryptedControllerAddress);

    try {
      // 1. Validate permission to update document
      // 1.1. Get address of current user from access token
      // success:
      //   { data: { address: string }  }
      const address = await axios.get(SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        })

      // 1.2. Compare controller address with user address
      if (controllerAddress !== address.data.data.address)
        return res.status(403).send(ERRORS.PERMISSION_DENIED);

      // 2. Check if document is not exist on DB 
      const existence = await axios.get(SERVERS.DID_CONTROLLER + "/api/doc/exists/",
        {
          headers: {
            companyName,
            fileName
          }
        });
      if (!existence.data.isExisted)
        return res.status(404).json(ERRORS.NOT_FOUND);

      // 3. Mint hash
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
      //   { error_code: number, error_message: string }
      const mintingNFT = await axios.put(SERVERS.CARDANO_SERVICE + "/api/storeHash/",
        {
          address: address.data.data.address,
          hashOfDocument: targetHash,
          previousHashOfDocument: previousHashOfDocument,
          originPolicyId: policyId
        },
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token}`
          }
        })

      // 3.2. Handle mintingNFT errors
      if (!mintingNFT.data.error_code)
        return res.status(400).json(mintingNFT.data);
      if (!mintingNFT) return res.status(400).json(ERRORS.CANNOT_MINT_NFT);

      // 3.3. Extract assetId
      const mintingNFTStatus = mintingNFT.data.data.result;
      assetId = mintingNFTStatus ? mintingNFT.data.data.token.assetId : "No assetId";

      // 4. Update new assetId for document
      newWrappedDocument.assetId = assetId;

      // 5. Call DID Controller to store document on DB
      const update = await axios.put(SERVERS.DID_CONTROLLER + "/api/doc",
        {
          fileName,
          didDoc: didDocumentOfWrappedDocument,
          companyName
        });
      update.data.errorCode
        ? res.status(400).json(update.data)
        : res.status(200).send("Update DID document of wrapped document.");
    }
    catch (err) {
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  }
}