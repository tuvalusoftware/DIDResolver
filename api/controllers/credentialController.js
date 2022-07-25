const axios = require("axios").default;
const {
  validateJSONSchema,
  getPublicKeyFromAddress,
  validateDIDSyntax,
} = require("../../core/index");
const { ERRORS, SERVERS, SCHEMAS } = require("../../core/constants");
const sha256 = require("js-sha256").sha256;

module.exports = {
  createCredential: async function (req, res) {
    console.log("Creating credential...");
    // Receive input data
    const { access_token } = req.cookies;
    const { indexOfCres, credential, payload, did, config } = req.body;

    console.log("Credential", config);

    // Handle input error
    // if (!indexOfCres || !credential || !payload || !did || !config)
    //   return res.status(200).json({
    //     ...ERRORS.MISSING_PARAMETERS,
    //     detail:
    //       "Not found:" + !indexOfCres
    //         ? " indexOfCres"
    //         : "" + !credential
    //         ? " credential"
    //         : "" + !payload
    //         ? " payload"
    //         : "" + !did
    //         ? " did"
    //         : "",
    //   });

    // Validate input
    // 0.1. Validate DID syntax
    const validDid = validateDIDSyntax(did, false);

    if (!validDid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        detail: "Invalid DID syntax.",
      });
    const companyName = validDid.companyName,
      fileName = validDid.fileNameOrPublicKey;

    console.log("Credential", credential);
    // 0.2. Validate credential

    try {
      // 1. Get wrapped document and did document of wrapped odcument
      // 1.1. Get did document and wrapped document of did document
      // sucess:
      //   { wrappedDoc: {}, didDoc: {} }
      // error:
      //   { error_code: number, message: string }
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

      console.log(1);

      // 3.2. Compare user address with public key from issuer did in credential
      // credential.issuer: did:method:companyName:publicKey
      const publicKey = getPublicKeyFromAddress(address.data.data.address),
        issuerDidComponents = credential.issuer.split(":");
      if (publicKey !== issuerDidComponents[issuerDidComponents.length - 1])
        return res.status(200).json(ERRORS.PERMISSION_DENIED); // 403
      console.log(2);
      // 3.3. Compare user address with controller address (from did document of wrapped document)
      if (didDocument.controller.indexOf(publicKey) < 0)
        // if (publicKey !== didDocument.owner && publicKey !== didDocument.holder)
        return res.status(200).json(ERRORS.PERMISSION_DENIED); // 403
      console.log(3);
      // 4. Call Cardano Service to verify signature
      // success:
      //   { data: { result: true/false } }
      // error:
      //   { error_code: stringify, error_message: string }
      // const verifiedSignature = await axios.post(
      //   SERVERS.CARDANO_SERVICE + "/api/v2/credential",
      //   {
      //     address: getPublicKeyFromAddress(address.data.data.address),
      //     payload,
      //     signature: credential.signature,
      //   },
      //   {
      //     withCredentials: true,
      //     headers: {
      //       Cookie: `access_token=${access_token};`,
      //     },
      //   }
      // );

      // console.log(verifiedSignature.data);
      // if (
      //   !verifiedSignature.data.data.result ||
      //   verifiedSignature.data.error_code
      // )
      //   return res.status(200).json({
      //     ...ERRORS.UNVERIFIED_SIGNATURE,
      //     detail: verifiedSignature.data,
      //   }); // 403

      // 5. Call Cardano Service to store new credential
      // success:
      //   {
      //     data:
      //     {
      //       result: true,
      //       token: { policyId: string, assetId: string }
      //     }
      //   }
      // error:
      //   { error_code: number, message: string }

      // * Cancel request after 4 seconds if no response from Cardano Service
      const source = axios.CancelToken.source();

      const mintingNFT = await axios.post(
        SERVERS.CARDANO_SERVICE + "/api/v2/credential",
        {
          config,
          credential: sha256(
            Buffer.from(JSON.stringify(credential), "utf8").toString("hex")
          ),
        },
        {
          // cancelToken: source.token,
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
        }
      );
      console.log(4, mintingNFT?.data);
      if (mintingNFT?.data?.code === 0) {
        console.log("TUTU", credential);
        // 7. Call DID_CONTROLLER
        // success:
        //   {}
        // error:
        //   { error_code: number, error_message: string}
        const storeCredentialStatus = await axios.post(
          SERVERS.DID_CONTROLLER + "/api/credential",
          {
            hash: sha256(
              Buffer.from(JSON.stringify(credential), "utf8").toString("hex")
            ),
            content: credential,
          }
        );
        return res.status(200).send(storeCredentialStatus.data);
      }
      return res.status(200).send(mintingNFT.data);
    } catch (err) {
      console.log("Error", err);
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  },

  getCredential: async function (req, res) {
    const { hash } = req.headers;
    try {
      const credential = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/credential",
        {
          headers: {
            hash: hash,
          },
        }
      );
      res.status(200).send(credential.data);
    } catch (e) {
      console.log(e);
      e.response
        ? res.status(400).json(e.response.data)
        : res.status(400).json(e);
    }
  },
};
