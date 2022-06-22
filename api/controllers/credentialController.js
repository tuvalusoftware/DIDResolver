
const axios = require("axios").default;
const { validateJSONSchema } = require("../../core/index");
const { ERRORS, SERVERS, SHEMAS } = require("../../core/constants");

module.exports = {
  createCredential: async function (req, res) {
    // Receive input data
    const access_token = req.cookies['access_token'];
    const { credential, did } = req.body;

    // Handle input error
    if (!credential || !did)
      return res.status(400).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found:"
          + (!credential) ? " credential" : ""
            + (!did) ? " did" : ""
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
        detail: valid.detail
      });

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
      .then((response) => console.log("createCredential..."))
      .catch((error) => console.log("UNAUTHORIZED"));

    // Call DID Controller to store new credential
    // success:
    //   { data: { result: true/false } }
    // error:
    //   { error_code: number, error_message: string }      
    await axios.post(SERVERS.CARDANO_SERVICE + "/api/verifySignature",
      {
        companyName: didComponents[2],
        publicKey: didComponents[3],
        credential: credential
      })
      .then((response) => {
        response.data.errorCode
          ? res.status(404).json(response.data)
          : res.status(201).send("Credential created.");
      })
      .catch((error) => {
        return error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      })
  },
}