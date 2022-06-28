
const axios = require("axios").default;
const { validateJSONSchema } = require("../../core/index");
const { ERRORS, SERVERS, SHEMAS } = require("../../core/constants");

module.exports = {
  createCredential: async function (req, res) {
    // Receive input data
    const access_token = req.cookies['access_token'];
    const { credential, did, address, payload } = req.body;

    // Handle input error
    if (!credential || !did || !address || !payload)
      return res.status(400).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found:"
          + (!credential) ? " credential" : ""
            + (!did) ? " did" : ""
              + (!address) ? " address" : ""
                + (!payload) ? " payload" : ""
      });

    // Validate input
    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] !== "did")
      return res.status(400).json({
        ...ERRORS.INVALID_INPUT,
        detail: "Invalid DID syntax."
      })

    const valid = validateJSONSchema(SHEMAS.CREDENTIAL, credential);
    console.log(valid.detail);
    if (!valid.valid)
      return res.status(400).json({
        ...ERRORS.INVALID_INPUT,
        errorMessage: "Bad request. Invalid credential.",
        detail: valid.detail
      });

    try {
      // Authentiacte
      // success:
      //   { data: { address: string } }
      // error: 401 - unauthorized
      await axios.get(SERVERS.AUTHENTICATION_SERVICE + "/api/auth/verify",
        {
          withCredentials: true,
          headers: {
            "Cookie": `access_token=${access_token};`
          }
        })
      // .then((response) => console.log("createCredential..."))
      // .catch((error) => console.log("UNAUTHORIZED"));

      // Call Cardano Service to verify signature
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

      // Call DID Controller to store new credential
      // success:
      //   { message: "success" }
      // error:
      //   { errorCode: number, message: string }      
      const storeCredentialStatus = await axios.post(SERVERS.DID_CONTROLLER + "/api/credential",
        {
          companyName: didComponents[2],
          publicKey: didComponents[3],
          credential: credential
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