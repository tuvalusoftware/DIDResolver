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
    const { indexOfCres, credential, payload, did } = req.body;

    // Handle input error
    const undefinedVar = checkUndefinedVar({
      indexOfCres,
      credential,
      payload,
      did,
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
    const valid = validateJSONSchema(SCHEMAS.CREDENTIAL, credential);
    if (!valid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        error_message: "Bad request. Invalid credential.",
        detail: valid.detail,
      });

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
      // ?? XIN ACCESS_TOKEN CUA HAOOOO EVERYTIME TEST CAI NAY
      // ?? UPDATE TOI DAY
      console.log(
        "-- Checking permission: current vs controller of DID document"
      );
      console.log(didDocument.controller.indexOf(publicKey));
      if (didDocument.controller.indexOf(publicKey) < 0)
        // if (publicKey !== didDocument.owner && publicKey !== didDocument.holder)
        return res.status(200).json(ERRORS.PERMISSION_DENIED); // 403

      // 4. Call Cardano Service to verify signature
      // success:
      //   { data: { result: true/false } }
      // error:
      //   { error_code: stringify, error_message: string }
      const verifiedSignature = await axios.post(
        SERVERS.CARDANO_SERVICE + "/api/verifySignature",
        {
          address: getPublicKeyFromAddress(address.data.data.address),
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

      console.log(verifiedSignature.data);
      if (
        !verifiedSignature.data.data.result ||
        verifiedSignature.data.error_code
      )
        return res.status(200).json({
          ...ERRORS.UNVERIFIED_SIGNATURE,
          detail: verifiedSignature.data,
        }); // 403

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
      let mintingNFT = null;
      setTimeout(() => {
        if (mintingNFT === null) {
          source.cancel();
        }
      }, 8000);

      console.log([{ ...credential }]);

      mintingNFT = await axios.put(
        SERVERS.CARDANO_SERVICE + "/api/storeCredentials",
        {
          address: address?.data?.data?.address,
          hashOfDocument,
          originPolicyId,
          indexOfCreds: indexOfCres,
          credentials: [
            sha256(
              Buffer.from(JSON.stringify(credential), "utf8").toString("hex")
            ),
          ],
        },
        {
          // cancelToken: source.token,
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token};`,
          },
        }
      );

      if (mintingNFT?.data?.data?.result) {
        // 7. Call DID_CONTROLLER
        // success:
        //   {}
        // error:
        //   { error_code: number, error_message: string}
        const storeCredentialStatus = await axios.post(
          SERVERS.DID_CONTROLLER + "/api/credential",
          {
            address: address?.data?.data?.address,
            hash: hashOfDocument,
            content: { credential },
          },
          {
            withCredentials: true,
            headers: {
              Cookie: `access_token=${access_token};`,
            },
          }
        );

        storeCredentialStatus.data.error_code
          ? res.status(200).json(storeCredentialStatus.data)
          : res.status(201).send("Credential created.");
      }
      res.status(200).send(mintingNFT.data);
    } catch (err) {
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
  },
};
