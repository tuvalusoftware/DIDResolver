const axios = require("axios").default;
const { ERRORS, SERVERS } = require("../../core/constants");

module.exports = {
  getDocuments: async function (req, res) {
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

    const companyName = didComponents[2];
    const fileName = didComponents[3];

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

    const companyName = didComponents[2];
    const publicKey = didComponents[3];

    // Call DID Controller
    // success: 
    //   { message: string }
    // error: 
    //   { errorCode: number, message: string }
    await axios.post(SERVERS.DID_CONTROLLER + "/api/did/",
      {
        companyName: companyName,
        publicKey: publicKey,
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


}