
const axios = require("axios").default;
const { validateJSONSchema } = require("../../core/index");
const { ERRORS, SERVERS, SHEMAS } = require("../../core/constants");

module.exports = {
  createCredential: async function (req, res) {
    // Receive input data
    const access_token = req.cookies['access_token'];
    const { indexOfCres, credential, payload, did } = req.body;

    // Handle input error
    if (!indexOfCres || !credential || !payload || !did)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found:"
          + (!indexOfCres) ? " indexOfCres" : ""
            + (!credential) ? " credential" : ""
              + (!payload) ? " payload" : ""
                + (!did) ? " did" : ""
      });

    // Validate input
    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] !== "did")
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        detail: "Invalid DID syntax."
      })
    const companyName = didComponents[2],
      fileName = didComponents[3];

    var valid = validateJSONSchema(SHEMAS.CREDENTIAL, credential);
    console.log(valid.detail);
    if (!valid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        errorMessage: "Bad request. Invalid credential.",
        detail: valid.detail
      });

    const documents = axios.get(SERVERS.DID_CONTROLLER + "/api/doc",
      {
        headers: {
          companyName,
          fileName
        }
      });
    const didDocument = documents.didDoc,
      wrappedDocument = documents.wrappedDoc;

    const originPolicyId = wrappedDocument.policyId,
      hashOfDocument = wrappedDocument.signature.targetHash;

    try {
      // 1. Validate permission to create credential
      // 1.1. Get address of current user from access token
      // success:
      //   { data: { address: string } }
      // error: 401 - unauthorized
      const address = await axios.get(SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        })
      // .then((response) => console.log("createCredential..."))
      // .catch((error) => console.log("UNAUTHORIZED"));

      // 1.2. Compare user addrss with controller address (from did document of wrapped document)??


      // 2. Call Cardano Service to verify signature
      // success:
      //   { data: { result: true/false } }
      // error:
      //   { error_code: stringify, error_message: string }
      const verifiedSignature = await axios.post(SERVERS.CARDANO_SERVICE + "api/verifySignature",
        {
          address,
          payload,
          signature: credential.signature
        },
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token}`
          }
        });

      if (verifiedSignature.data.error_code)
        res.status(200).json(ERRORS.UNVERIFIED_SIGNATURE); // 403

      // 3. Call Cardano Service to store new credential
      // success:
      //   {
      //     data: 
      //     {
      //       result: true,
      //       token: { policyId: string, assetId: string }
      //     }
      //   }
      // error:
      //   { errorCode: number, message: string }
      const storeCredentialStatus = await axios.post(SERVERS.CARDANO_SERVICE + "/api/storeCredential",
        {
          address: address.data.data.address,
          hashOfDocument,
          originPolicyId,
          indexOfCres,
          credentials: [{ ...credential }]
        });

      storeCredentialStatus.data.errorCode
        ? res.status(200).json(storeCredentialStatus.data)
        : res.status(201).send("Credential created.");
    }
    catch (err) {
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  },
}