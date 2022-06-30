const axios = require("axios").default;
const {
  validateJSONSchema,
  getPublicKeyFromAddress,
} = require("../../core/index");
const { ERRORS, SERVERS, SHEMAS } = require("../../core/constants");

module.exports = {
  createCredential: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { indexOfCres, credential, payload, did } = req.body;

    // Handle input error
    if (!indexOfCres || !credential || !payload || !did)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail:
          "Not found:" + !indexOfCres
            ? " indexOfCres"
            : "" + !credential
            ? " credential"
            : "" + !payload
            ? " payload"
            : "" + !did
            ? " did"
            : "",
      });

    // Validate input
    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] !== "did")
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        detail: "Invalid DID syntax.",
      });
    const companyName = didComponents[2],
      fileName = didComponents[3];

    var valid = validateJSONSchema(SHEMAS.CREDENTIAL, credential);
    if (!valid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        errorMessage: "Bad request. Invalid credential.",
        detail: valid.detail,
      });
    try {
      // 1. Get wrapped document and did document of wrapped odcument
      // 1.1. Get did document and wrapped document of did document
      // sucess:
      //   { wrappedDoc: {}, didDoc: {} }
      // error:
      //   { errorCode: number, message: string }
      const documents = await axios.get(SERVERS.DID_CONTROLLER + "/api/doc", {
        headers: {
          companyName,
          fileName,
        },
      });
      const didDocument = documents.data.didDoc,
        wrappedDocument = documents.data.wrappedDoc;
      const originPolicyId = wrappedDocument.policyId,
        hashOfDocument = wrappedDocument.signature.targetHash;

      // 3. Validate permission to create credential
      // 3.1. Get address of current user from access token
      // success:
      //   { data: { address: string } }
      // error: 401 - unauthorized
      const address = await axios.get(
        SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
        }
      );
      // .then((response) => console.log("createCredential..."))
      // .catch((error) => console.log("UNAUTHORIZED"));
      // 3.2. Compare user address with public key from issuer did in credential
      publicKey = getPublicKeyFromAddress(address.data.data.address);
      issuerDidComponents = credential.issuer.split(":");
      if (publicKey !== issuerDidComponents[issuerDidComponents.length - 1])
        return res.status(200).json(ERRORS.PERMISSION_DENIED); // 403

      // 3.3. Compare user address with controller address (from did document of wrapped document)??
      if (publicKey !== didDocument.owner && publicKey !== didDocument.holder)
        return res.status(200).json(ERRORS.PERMISSION_DENIED); // 403

      // 4. Call Cardano Service to verify signature
      // success:
      //   { data: { result: true/false } }
      // error:
      //   { error_code: stringify, error_message: string }
      const verifiedSignature = await axios.post(
        SERVERS.CARDANO_SERVICE + "/api/verifySignature",
        {
          address: address.data.data.address,
          payload,
          signature: credential.signature,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
        }
      );
      if (verifiedSignature.data.error_code)
        return res.status(200).json(ERRORS.UNVERIFIED_SIGNATURE); // 403

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

      // * Cancel request after 4 seconds if no response from Cardano Service
      const source = axios.CancelToken.source();
      let storeCredentialStatus = null;
      setTimeout(() => {
        if (storeCredentialStatus === null) {
          source.cancel();
        }
      }, 4000);

      storeCredentialStatus = await axios.put(
        SERVERS.CARDANO_SERVICE + "/api/storeCredentials",
        {
          address: address?.data?.data?.address,
          hashOfDocument,
          originPolicyId,
          indexOfCres,
          credentials: [{ ...credential }],
        },
        {
          cancelToken: source.token,
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
        }
      );
      storeCredentialStatus.data.errorCode
        ? res.status(200).json(storeCredentialStatus.data)
        : res.status(201).send("Credential created.");
    } catch (err) {
      console.log(err);
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  },
};
