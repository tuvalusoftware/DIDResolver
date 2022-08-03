const axios = require("axios").default;
const {
  validateJSONSchema,
  getPublicKeyFromAddress,
  validateDIDSyntax,
  checkUndefinedVar,
} = require("../../core/index");
const { ERRORS, SERVERS, SCHEMAS } = require("../../core/constants");
const sha256 = require("js-sha256").sha256;
// const aesjs = require("aes-js");
const Logger = require("../../logger");

module.exports = {
  createCredential: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { credential, did, config } = req.body;

    try {
      // Handle input error
      const undefinedVar = checkUndefinedVar({
        credential,
        did,
        config,
      });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });

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

      // 0.2. Validate credential
      // ? CHECK THIS
      const valid = validateJSONSchema(SCHEMAS.CREDENTIAL, credential);
      if (!valid.valid)
        return res.status(200).json({
          ...ERRORS.INVALID_INPUT,
          detail: valid.detail,
        });

      // * 1. Get wrapped document and did document of wrapped odcument
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
      // const originPolicyId = wrappedDocument.policyId,
      //   hashOfDocument = wrappedDocument.signature.targetHash;

      if (didDocument && wrappedDocument)
        Logger.info(
          `didDocument: ${JSON.stringify(
            didDocument
          )}\n wrappedDocument: ${JSON.stringify(wrappedDocument)}`
        );

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
      //   {
      //     code: number,
      //     message: String,
      //     data: true/false
      //   }
      // error:
      //   { error_code: number, message: string }
      const mintingNFT = await axios.post(
        SERVERS.CARDANO_SERVICE + "/api/v2/credential",
        {
          address: getPublicKeyFromAddress(address.data.data.address),
          payload: payload,
          signature: credential.signature,
          // key: ??
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
        }
      );
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
    } catch (err) {
      Logger.apiError(req, res, `${JSON.stringify(err)}`);
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }

    // 5. Store credential on Cardano service and github
    // 5.1 Call Cardano Service to store new credential
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

    // // * Cancel request after 4 seconds if no response from Cardano Service
    // const source = axios.CancelToken.source();

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

    const storeCredentialStatus = await axios.post(
      SERVERS.DID_CONTROLLER + "api/credential",
      {
        hash: sha256(
          Buffer.from(JSON.stringify(credential), "utf-8".toString("hex"))
        ),
        content: credential,
      },
      {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${access_token};`,
        },
      }
    );

    Promise.all([mintingNFT, storeCredentialStatus])
      .then(({ data }) => {
        Logger.apiInfo(req, res, `Success.\n${JSON.stringify(data)}`);
      })
      .catch((error) => {
        Logger.apiError(req, res, `${JSON.stringify(error)}`);
        error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
    res.status(201).send("Credential created.");

    // if (mintingNFT?.data?.code === 0) {
    //   // 7. Call DID_CONTROLLER
    //   // success:
    //   //   {}
    //   // error:
    //   //   { error_code: number, error_message: string}
    //   const storeCredentialStatus = await axios.post(
    //     SERVERS.DID_CONTROLLER + "/api/credential",
    //     {
    //       hash: sha256(
    //         Buffer.from(JSON.stringify(credential), "utf8").toString("hex")
    //       ),
    //       content: credential,
    //     },
    //     {
    //       withCredentials: true,
    //       headers: {
    //         Cookie: `access_token=${access_token};`,
    //       },
    //     }
    //   );
    //   return res.status(200).send(storeCredentialStatus.data);
    // }
    // return res.status(200).send(mintingNFT.data);
  },

  getCredential: async function (req, res) {
    const { hash } = req.headers;
    const { access_token } = req.cookies;
    try {
      const { data } = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/credential",
        {
          withCredentials: true,
          headers: {
            hash: hash,
            Cookie: `access_token=${access_token};`,
          },
        }
      );
      Logger.apiInfo(req, res, `Success.\n${JSON.stringify(data)}`);
      res.status(200).send(data);
    } catch (e) {
      Logger.apiError(req, res, `${JSON.stringify(e)}`);
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
