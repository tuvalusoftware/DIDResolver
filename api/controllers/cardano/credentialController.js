const axios = require("axios").default;
const {
    validateJSONSchema,
    getPublicKeyFromAddress,
    validateDIDSyntax,
    checkUndefinedVar,
} = require("../../../core/index");
const { ERRORS, SERVERS, SCHEMAS } = require("../../../core/constants");
const sha256 = require("js-sha256").sha256;
const Logger = require("../../../logger");

axios.defaults.withCredentials = true;

module.exports = {
    createCredential: async function (req, res) {
        const { access_token } = req.cookies;
        const { credential, did, config } = req.body;
        try {
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
            const valid = validateJSONSchema(SCHEMAS.CREDENTIAL, credential);
            if (!valid.valid)
                return res.status(200).json({
                    ...ERRORS.INVALID_INPUT,
                    detail: valid.detail,
                });

            // * Get list of nfts with given policy-id
            const fetchNftResult = await axios.post(
                `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
                {
                    policyId: config?.policy?.id,
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                }
            );
            if(!fetchNftResult || !fetchNftResult?.data) {
                throw ERRORS.SYSTEM_MISS_CONCEPTION;
            }
            if (fetchNftResult?.data?.error_code) {
                throw fetchNftResult?.data;
            }
            // * Get all of nfts which have type credential
            const transactions = fetchNftResult?.data?.data.filter(
                (_item) =>
                    _item.onchainMetadata.type === "credential"
            );
            if (transactions.length > 0) {
                // * Get to last credential nft to get the last information of did of given document
                const getCredentialResult = await axios.get(
                    SERVERS.DID_CONTROLLER + "/api/credential",
                    {
                        withCredentials: true,
                        headers: {
                            Cookie: `access_token=${access_token};`,
                        },
                        params: {
                            hash: transactions[transactions.length - 1]
                                ?.assetName,
                        },
                    }
                );
                if (getCredentialResult?.data?.error_code) {
                    throw getCredentialResult?.data;
                }
                // * Get to object of credential got from github by assetName (hash of credential got from blockchain)
                let currentCredential = { ...getCredentialResult?.data };
                delete currentCredential.mintingNFTConfig;
                Logger.info(
                    `Successfully get content of last credential from Github`
                );
                if (
                    transactions[transactions.length - 1]?.assetName !==
                    sha256(
                        Buffer.from(
                            JSON.stringify(currentCredential),
                            "utf8"
                        ).toString("hex")
                    )
                ) {
                    return res.status(200).json(ERRORS.SYSTEM_MISS_CONCEPTION);
                }
                Logger.info(
                    `Successfully comparing hash of current credential content with asset-name got from blockchain`
                );
                const currentDocumentFileName =
                    currentCredential?.credentialSubject?.object.split(":")[3];
                const currentCompanyName =
                    getCredentialResult?.data?.issuer.split(":")[2];

                // * Get current did of document from Github
                const getDocumentDidResult = await axios.get(
                    SERVERS.DID_CONTROLLER + "/api/doc",
                    {
                        withCredentials: true,
                        headers: {
                            Cookie: `access_token=${access_token}`,
                        },
                        params: {
                            companyName: currentCompanyName,
                            fileName: currentDocumentFileName,
                            only: "did",
                        },
                    }
                );
                if (getDocumentDidResult?.data?.error_code) {
                    throw getDocumentDidResult?.data;
                }

                // * Compare each public key in controller with data saved in credential, in this case, the data saved in credential are unchanged since the hash of credential unchanged
                for (let i in currentCredential?.metadata) {
                    if (
                        getDocumentDidResult?.data?.didDoc?.controller.indexOf(
                            currentCredential?.metadata[i]
                        ) < 0
                    ) {
                        return res
                            .status(200)
                            .json(ERRORS.SYSTEM_MISS_CONCEPTION);
                    }
                }
                Logger.info(
                    `Successfully comparing each controller's public-key of current credential content with did of document`
                );
            }

            // * 1. Get wrapped document and did document of wrapped document
            const documents = await axios.get(
                SERVERS.DID_CONTROLLER + "/api/doc",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                    params: {
                        companyName,
                        fileName,
                    },
                }
            );

            if (documents?.data?.error_code) {
                Logger.apiError(req, res, `${JSON.stringify(documents.data)}`);
                return res.status(200).json({
                    ...ERRORS.INVALID_INPUT,
                    detail: documents.data,
                });
            }

            const didDocument = documents.data.didDoc,
                wrappedDocument = documents.data.wrappedDoc;

            if (didDocument && wrappedDocument)
                Logger.info(
                    `didDocument: ${JSON.stringify(
                        didDocument
                    )}\n wrappedDocument: ${JSON.stringify(wrappedDocument)}`
                );

            // 2. Validate permission to create credential
            // 2.1. Get address of current user from access token
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

            // 2.2. Compare user address with public key from issuer did in credential
            // credential.issuer: did:method:companyName:publicKey --> Compare this with publicKey(address)
            const publicKey = address?.data?.data?.address,
                issuerDidComponents = credential?.issuer?.split(":");
            if (
                publicKey !==
                issuerDidComponents[issuerDidComponents.length - 1]
            ) {
                Logger.apiError(
                    req,
                    res,
                    `Unmatch PK.\n
            PK from credential.issuer: ${
                issuerDidComponents[issuerDidComponents.length - 1]
            }\n
            Current user PK: ${publicKey}`
                );
                return res.status(200).json(ERRORS.PERMISSION_DENIED); // 403
            } else
                Logger.apiInfo(
                    req,
                    res,
                    `PK matchs credential.issuer PK. PK: ${publicKey}`
                );

            // * 2.3. Compare user address with controller address (from did document of wrapped document)
            if (didDocument.controller.indexOf(publicKey) < 0)
                // if (publicKey !== didDocument.owner && publicKey !== didDocument.holder)
                return res.status(200).json(ERRORS.PERMISSION_DENIED);

            // 4. Call Cardano Service to verify signature
            // success:
            //   {
            //     code: number,
            //     message: String,
            //     data: true/false
            //   }
            // error:
            //   { code: 0, message: string }

            // * Cancel request after 4 seconds if no response from Cardano Service
            const source = axios.CancelToken.source();
            const mintingNFT = await axios.post(
                SERVERS.CARDANO_SERVICE + "/api/v2/credential",
                {
                    config,
                    credential: sha256(
                        Buffer.from(
                            JSON.stringify(credential),
                            "utf8"
                        ).toString("hex")
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

            if (mintingNFT?.data?.code) {
                Logger.apiError(req, res, `${JSON.stringify(mintingNFT.data)}`);
                return res.status(200).json({
                    ...ERRORS.CANNOT_MINT_NFT,
                    detail: mintingNFT.data,
                });
            } else {
                // 4. Call DID_CONTROLLER
                // success:
                //   {}
                // error:
                //   { error_code: number, message: string}
                const storeCredentialStatus = await axios.post(
                    SERVERS.DID_CONTROLLER + "/api/credential",
                    {
                        hash: sha256(
                            Buffer.from(
                                JSON.stringify(credential),
                                "utf8"
                            ).toString("hex")
                        ),
                        content: {
                            ...credential,
                            mintingNFTConfig: mintingNFT?.data?.data,
                        },
                    },
                    {
                        headers: {
                            Cookie: `access_token=${access_token};`,
                        },
                    }
                );

                return res.status(200).send(storeCredentialStatus.data);
            }
        } catch (err) {
            err.response
                ? res.status(400).json(err.response.data)
                : res.status(400).json(err);
        }
    },

    getCredential: async function (req, res) {
        const { hash } = req.headers;
        const { access_token } = req.cookies;
        try {
            // Validate input
            const undefinedVar = checkUndefinedVar({
                hash,
            });
            if (undefinedVar.undefined)
                return res.status(200).json({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });

            const { data } = await axios.get(
                SERVERS.DID_CONTROLLER + "/api/credential",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                    params: {
                        hash,
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
        const { access_token } = req.cookies;
        const { originCredentialHash, credentialContent } = req.body;
        try {
            // Validate input
            const undefinedVar = checkUndefinedVar({
                originCredentialHash,
                credentialContent,
            });
            if (undefinedVar.undefined)
                return res.status(200).json({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });

            const storeCredentialStatus = await axios.put(
                SERVERS.DID_CONTROLLER + "/api/credential",
                {
                    hash: originCredentialHash,
                    content: credentialContent,
                },
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                }
            );
            return res.status(200).send(storeCredentialStatus.data);
        } catch (err) {
            err.response
                ? res.status(400).json(err.response.data)
                : res.status(400).json(err);
        }
    },
};