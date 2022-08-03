const axios = require("axios").default;
const {
  validateJSONSchema,
  getPublicKeyFromAddress,
  validateDIDSyntax,
  checkUndefinedVar,
} = require("../../core/index");
const { ERRORS, SERVERS, SCHEMAS } = require("../../core/constants");
const sha256 = require("js-sha256").sha256;
const aesjs = require("aes-js");
const Logger = require("../../logger");

module.exports = {
  createCredential: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { indexOfCres, credential, payload, did, config } = req.body;

    console.log("Credential", config);

    // Handle input error
    // const undefinedVar = checkUndefinedVar({
    //   indexOfCres,
    //   credential,
    //   payload,
    //   did,
    // });
    // if (undefinedVar.undefined)
    //   return res.status(200).json({
    //     ...ERRORS.MISSING_PARAMETERS,
    //     detail: undefinedVar.detail,
    //   });

    // 0. Validate input
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
      // * 1. Get wrapped document and did document of wrapped odcument
      Logger.apiInfo(
        req,
        res,
        `Get wrappedDoc and didDoc of ${companyName}:${fileName}`
      );
      // sucess:
      //   { wrappedDoc: {}, didDoc: {} }
      // error:
      //   { error_code: number, message: string }
      const documents = await axios.get(SERVERS.DID_CONTROLLER + "/api/doc", {
        withCredentials: true,
        headers: {
          companyName,
          fileName,
          Cookie: `access_token=${access_token};`,
        },
      });
      const didDocument = documents.data.didDoc,
        wrappedDocument = documents.data.wrappedDoc;
      const originPolicyId = wrappedDocument.policyId,
        hashOfDocument = wrappedDocument.signature.targetHash;

      // * 2. Validate permission to create credential
      // * 2.1. Get address of current user from access token
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

      // * 2.2. Compare user address with public key from issuer did in credential
      // credential.issuer: did:method:companyName:publicKey --> Compare this with publicKey(address)
      const publicKey = getPublicKeyFromAddress(address.data.data.address),
        issuerDidComponents = credential.issuer.split(":");
      if (publicKey !== issuerDidComponents[issuerDidComponents.length - 1]) {
        Logger.apiError(
          req,
          res,
          `Unmatch publicKkey.\n
            from credential.issuer: ${
              issuerDidComponents[issuerDidComponents.length - 1]
            }\n
            from address: ${publicKey}`
        );
        return res.status(200).json(ERRORS.PERMISSION_DENIED); // 403
      }

      // * 2.3. Compare user address with controller address (from did document of wrapped document)
      // ?? UPDATE TOI DAY
      if (didDocument.controller.indexOf(publicKey) < 0)
        // if (publicKey !== didDocument.owner && publicKey !== didDocument.holder)
        return res.status(200).json(ERRORS.PERMISSION_DENIED); // 403
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
      console.log(mintingNFT.data);
      if (mintingNFT?.data?.code === 0) {
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
            content: {
              ...credential,
              mintingNFTConfig: mintingNFT?.data?.data,
            },
          },
          {
            // cancelToken: source.token,
            withCredentials: true,
            headers: {
              Cookie: `access_token=${access_token};`,
            },
          }
        );
        console.log(storeCredentialStatus?.data)
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
    const { access_token } = req.cookies;
    try {
      const credential = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/credential",
        {
          headers: {
            hash: hash,
            Cookie: `access_token=${access_token};`,
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

  updateCredential: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { originCredentialHash, credentialContent } = req.body;
    console.log({ originCredentialHash, credentialContent } )
    try  {
      const storeCredentialStatus = await axios.put(
        SERVERS.DID_CONTROLLER + "/api/credential",
        {
          hash: originCredentialHash,
          content: credentialContent
        }
      );
      console.log('Res', storeCredentialStatus.data)
      return res.status(200).send(storeCredentialStatus.data);    
    } catch (err) {
      console.log("Error", err);
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  },
};
