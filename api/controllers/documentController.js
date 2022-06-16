const axios = require("axios").default;
const { stringify } = require("ajv");
const { ERRORS, SERVERS } = require("../../core/constants");

module.exports = {
  getDocuments: async function (req, res) {
    console.log("RUN GET DOCUMENTS");

    // Receive input data
    const { did } = req.headers;
    const { exclude } = req.query;

    // Handle input errors
    if (!did)
      return res.status(400).json(ERRORS.MISSING_PARAMETERS);

    const didComponents = did.split(":");
    if (didComponents.length < 6 || didComponents[2] != "did")
      return res.status(400).json(ERRORS.INVALID_INPUT);

    // Call DID Controller
    // success:
    //   {
    //     didDoc: {},
    //     wrappedDoc: {}
    //   }
    // error: 
    //   { errorCode: number, message: string }
    await axios
      .get(SERVERS.DID_CONTROLLER + "/api/doc", {
        headers: {
          companyName: didComponents[4],
          fileName: didComponents[5]
        },
        params: { exclude }
      })
      .then((response) => {
        console.log(response);
        response.data.errorCode
          ? res.status(404).send(response.data.message)
          : res.status(200).json(response.data);
      })
      .catch((error) => {
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error)
      });
  },

  getDIDDocument: async function (req, res) {
    // Receive input data
    const { did } = req.headers;

    // Handle input errors
    if (!did) return res.status(400).json(ERRORS.MISSING_PARAMETERS);

    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did")
      return res.status(400).json(ERRORS.INVALID_INPUT);

    // Extract data required to call services
    const companyName = didComponents[2],
      fileName = didComponents[3];

    // Call DID Controller
    // success:
    //   { ... }
    // error:
    //   { errorCode: number, message: string }
    await axios
      .get(DID_CONTROLLER + "/api/did/",
        {
          headers: {
            companyName: companyName,
            publicKey: fileName,
          },
        })
      .then((response) =>
        response.data.errorCode
          ? res.status(404).json(response.data)
          : res.status(200).json(response.data))
      .catch((error) =>
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error)
      );
  },

  createDIDDocument: async function (req, res) {
    // Receive input data
    const { did, didDocument } = req.body;

    // Handle input errors
    if (!did || !didDocument)
      return res.status(400).json(ERRORS.MISSING_PARAMETERS)

    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did")
      return res.status(400).json(ERRORS.INVALID_INPUT);

    // Extract data required to call services
    const companyName = didComponents[2],
      fileName = didComponents[3];

    // Call DID Controller
    // success: 
    //   { message: string }
    // error: 
    //   { errorCode: number, message: string }
    await axios.post(SERVERS.DID_CONTROLLER + "/api/did/",
      {
        companyName: companyName,
        publicKey: fileName,
        content: didDocument,
      })
      .then((response) => {
        console.log(response.data);
        response.data.errorCode
          ? res.status(400).json(response.data)
          : res.status(201).send("DID Document created.")
      })
      .catch((error) => {
        console.log(error);
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error)
      });
  },

  checkWrappedDocumentExistence: async function (req, res) {
    // Receive input data
    const { companyname: companyName, filename: fileName } = req.headers;

    // Handle input errors
    if (!companyName || !fileName)
      return res.status(400).json(ERRORS.MISSING_PARAMETERS);

    // Call DID Contoller
    // success:
    //   { isExisted: true/false }
    await axios.get(SERVERS.DID_CONTROLLER + "/api/doc/exists/",
      {
        headers: {
          companyName,
          fileName,
        },
      })
      .then((existence) => res.status(200).json(existence.data.isExisted))
      .catch((error) =>
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error)
      );
  },

  createWrappedDocument: async function (req, res) {
    // Get access-token from request and receive input data
    const access_token = req.cookies['access_token'];
    const { wrappedDocument, issuerAddress: encryptedIssuerAddress, did } = req.body;

    // Handle input errors
    if (!wrappedDocument || !encryptedIssuerAddress || !did) {
      return res.status(400).json(ERRORS.MISSING_PARAMETERS);
    }
    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] !== "did") {
      return res.status(400).json(ERRORS.INVALID_INPUT);
    }

    // Extract data required to call services
    const companyName = didComponents[2],
      fileName = didComponents[3],
      targetHash = wrappedDocument.signature.targetHash,
      issuerAddress = getAddressFromHexEncoded(encryptedIssuerAddress);

    try {
      // 1. Validate permission to create document. 
      // 1.1 Get address of user from the acess token. 
      // success: 
      //   { data: { address: string } }
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
      //   { error_code: { error_code: number, error_message: string } }
      const mintingNFT = await axios.put(SERVERS.CARDANO_SERVICE + "/api/storeHash/",
        {
          address: issuerAddress,
          hashOfDocument: targetHash,
          previousHashOfDocument: "EMPTY",
          originPolicyId: "EMPTY"
        },
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token}`
          }
        });

      // 3.2. Handle store hash errors 
      if (mintingNFT.error_code) {
        return res.status(400).json(mintingNFT.data);
      }
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
      const storingWrappedDocumentStatus = await axios.post((DID_CONTROLLER + "/api/doc"),
        {
          fileName,
          wrappedDocument,
          companyName,
        }
      );

      // 6. Return policyId an assetId if the process is success.
      storingWrappedDocumentStatus.data.errorCode
        ? res.status(400).json(storingWrappedDocumentStatus.data)
        : res.status(200).json({
          policyId: policyId,
          assetId: assetId
        })
    }
    catch (err) {
      console.log("CATCH ERROR");
      console.log(err);
      return err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  },


}