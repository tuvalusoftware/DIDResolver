// * Utilities
import {
    checkForSpecialChar,
    checkLengthOfInput,
    checkForStringEndWithSpecialCharacters,
    nonIsoValidator,
    checkRequirementOfInput,
    unsalt,
} from "../fuixlabs-documentor/utils/data.js";
import { generateDid } from "../fuixlabs-documentor/utils/did.js";
import {
    wrapDocument,
    createWrappedDocument,
} from "../fuixlabs-documentor/utils/document.js";
import { deepMap } from "../fuixlabs-documentor/utils/salt.js";
import {
    validateDIDSyntax,
    checkUndefinedVar,
    getPublicKeyFromAddress,
    getDidByComponents,
    requireFieldInArray,
} from "./index.js";
import axios from "axios";
import "dotenv/config";

// * Constants
import { VERIFIER_ERROR_CODE } from "../fuixlabs-documentor/constants/error.js";
import {
    VALID_DOCUMENT_NAME_TYPE,
    SAMPLE_SERVICE,
    _DOCUMENT_TYPE,
} from "../fuixlabs-documentor/constants/type.js";
import { env } from "../configs/constants.js";
import { ERRORS } from "../configs/errors/error.constants.js";
import ControllerService from "../services/Controller.service.js";
import CardanoService from "../services/Cardano.service.js";

/**
 * Function used for generating wrapped document
 * @param {Object} wrappedDocument
 * @param {String} encryptedIssuerAddress
 * @param {Object} mintingNFTConfig
 * @param {String} access_token
 * @returns {Promise<Object>} - Promise object includes wrapped document
 */
export const generateWrappedDocument = async ({
    wrappedDocument,
    encryptedIssuerAddress,
    mintingNFTConfig,
    access_token,
    ddidDocument,
}) => {
    try {
        const undefinedVar = checkUndefinedVar({
            wrappedDocument,
            encryptedIssuerAddress,
            access_token,
        });
        if (undefinedVar.undefined) {
            throw {
                ...ERRORS.MISSING_PARAMETERS,
                detail: undefinedVar.detail,
            };
        }
        const did = wrappedDocument.data?.did,
            validDid = validateDIDSyntax(did, true),
            companyName = validDid.companyName,
            fileName = validDid.fileNameOrPublicKey;
        if (!validDid.valid)
            throw {
                ...ERRORS.INVALID_INPUT,
                detail: "Invalid DID syntax. Check did element.",
            };
        const targetHash = wrappedDocument?.signature?.targetHash;
        const existence = await axios.get(
            env.DID_CONTROLLER + "/api/doc/exists",
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
        if (existence?.data?.isExisted) {
            throw ERRORS.ALREADY_EXSISTED;
        }
        const didComponents = ddidDocument.split(":");
        let mintBody = {
                hash: targetHash,
                did: didComponents[2] + ":" + didComponents[3],
            },
            mintingNFT;
        if (mintingNFTConfig) {
            mintBody = {
                newHash: targetHash,
                config: { ...mintingNFTConfig, burn: false },
                did: didComponents[2] + ":" + didComponents[3],
            };
            mintingNFT = await axios.put(
                env.CARDANO_SERVICE + "/api/v2/hash/",
                mintBody,
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                }
            );
        } else {
            mintingNFT = await axios.post(
                env.CARDANO_SERVICE + "/api/v2/hash",
                mintBody,
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                }
            );
        }
        if (!mintingNFT) throw ERRORS.CANNOT_MINT_NFT;
        if (mintingNFT?.data?.code !== 0) {
            throw {
                ...ERRORS.CANNOT_MINT_NFT,
                detail: mintingNFT?.data,
            };
        }
        const _mintingNFTConfig = mintingNFT?.data?.data
            ? mintingNFT?.data?.data
            : false;
        wrappedDocument = {
            ...wrappedDocument,
            mintingNFTConfig: _mintingNFTConfig,
        };
        const storeWrappedDocumentStatus = await axios.post(
            env.DID_CONTROLLER + "/api/doc",
            {
                fileName,
                wrappedDocument,
                companyName,
            },
            {
                withCredentials: true,
                headers: { Cookie: `access_token=${access_token};` },
            }
        );
        if (storeWrappedDocumentStatus?.data?.error_code) {
            throw storeWrappedDocumentStatus.data;
        }
        return wrappedDocument;
    } catch (e) {
        throw e;
    }
};

/**
 * Function used for hashing document content
 * @param {Object} document - document object
 * @param {String} address - address of issuer
 * @returns {Promise<String>} - Promise object includes target hash
 */
export const hashDocumentContent = async ({ document, address }) => {
    try {
        document = deepMap(document, unsalt);
        let createdDocument = {};
        for (const key in document) {
            let currentField = document[key];
            if (key === "fileName") {
                let specialVar = checkForSpecialChar({ currentField });
                let lengthVar = checkLengthOfInput(currentField);
                if (!lengthVar?.valid) {
                    throw VERIFIER_ERROR_CODE.FILENAME_IS_TOO_SHORT;
                }
                if (!specialVar?.valid) {
                    throw VERIFIER_ERROR_CODE.STRING_INCLUDE_SPECIAL_CHARATERS;
                }
                let endWithSpecialCharacters =
                    checkForStringEndWithSpecialCharacters(currentField);
                if (!endWithSpecialCharacters?.valid) {
                    throw VERIFIER_ERROR_CODE.END_WITH_SPECIAL_CHARACTER;
                }
                if (!nonIsoValidator(currentField)) {
                    throw VERIFIER_ERROR_CODE.STRING_INCLUDE_SPECIAL_CHARATERS;
                }
            } else {
                let lengthVar = checkRequirementOfInput(currentField);
                if (!lengthVar?.valid) {
                    throw {
                        error_code: 400,
                        error_message: `${
                            lengthVar?._key || key
                        } is required! Please check your input again!`,
                    };
                }
            }
            if (key !== "did")
                createdDocument = Object.assign(createdDocument, {
                    [key]: document[key],
                });
        }
        createdDocument = Object.assign(createdDocument, {
            companyName: env.COMPANY_NAME,
            intention: VALID_DOCUMENT_NAME_TYPE.find(
                (prop) => prop.name === createdDocument.name
            ).type,
        });
        const did = generateDid(env.COMPANY_NAME, address);
        let { targetHash } = await createWrappedDocument(
            createdDocument,
            SAMPLE_SERVICE,
            address,
            did
        );
        return targetHash;
    } catch (e) {
        throw e;
    }
};

/**
 * Function used for create new wrapped document for Commonlands Project with document object, current user's public key
 * @param {Array} documents - array of documents
 * @param {address} address - address of issuer
 * @param {String} seedPhrase - seed phrase of issuer
 * @returns {Promise<Object>} - Promise object includes wrapped document
 */
export const createDocumentForCommonlands = async ({
    documents,
    address,
    access_token,
    client,
    currentWallet,
    companyName,
    mintingConfig,
}) => {
    try {
        for (let index = 0; index < documents.length; index++) {
            let document = documents[index];
            document = deepMap(document, unsalt);
            try {
                let createdDocument = {};
                for (const key in document) {
                    let currentField = document[key];
                    if (key === "fileName") {
                        let specialVar = checkForSpecialChar({ currentField });
                        let lengthVar = checkLengthOfInput(currentField);
                        if (!lengthVar?.valid) {
                            throw VERIFIER_ERROR_CODE.FILENAME_IS_TOO_SHORT;
                        }
                        if (!specialVar?.valid) {
                            throw VERIFIER_ERROR_CODE.STRING_INCLUDE_SPECIAL_CHARATERS;
                        }
                        let endWithSpecialCharacters =
                            checkForStringEndWithSpecialCharacters(
                                currentField
                            );
                        if (!endWithSpecialCharacters?.valid) {
                            throw VERIFIER_ERROR_CODE.END_WITH_SPECIAL_CHARACTER;
                        }
                        if (!nonIsoValidator(currentField)) {
                            throw VERIFIER_ERROR_CODE.STRING_INCLUDE_SPECIAL_CHARATERS;
                        }
                    } else {
                        let lengthVar = checkRequirementOfInput(currentField);
                        if (!lengthVar?.valid) {
                            throw {
                                error_code: 400,
                                error_message: `${
                                    lengthVar?._key || key
                                } is required! Please check your input again!`,
                            };
                        }
                    }
                    if (key !== "did")
                        createdDocument = Object.assign(createdDocument, {
                            [key]: document[key],
                        });
                }
                createdDocument = Object.assign(createdDocument, {
                    companyName: companyName,
                    intention: VALID_DOCUMENT_NAME_TYPE.find(
                        (prop) => prop.name === createdDocument.name
                    ).type,
                });
                const did = generateDid(companyName, address);
                let res = await createWrappedDocument(
                    createdDocument,
                    SAMPLE_SERVICE,
                    address,
                    did
                );
                const { _document, targetHash, ddidDocument } = res;
                const signMessage = await client
                    ?.newMessage(
                        getPublicKeyFromAddress(currentWallet?.paymentAddr),
                        Buffer.from(
                            JSON.stringify({
                                address: getPublicKeyFromAddress(
                                    currentWallet?.paymentAddr
                                ),
                                targetHash: targetHash,
                            })
                        ).toString("hex")
                    )
                    .sign();
                const wrappedDocument = wrapDocument({
                    document: _document,
                    walletAddress: address,
                    signedData: signMessage,
                    targetHash: targetHash,
                });
                const requestBody = {
                    wrappedDocument: wrappedDocument,
                    encryptedIssuerAddress: address,
                    ddidDocument: ddidDocument,
                    access_token: access_token,
                    mintingNFTConfig: mintingConfig,
                };
                const wrappedResult = await generateWrappedDocument(
                    requestBody
                );
                return {
                    wrappedDocument: wrappedResult,
                };
            } catch (e) {
                throw (
                    e ||
                    e?.error_message ||
                    "Something went wrong! Please try again later."
                );
            }
        }
    } catch (e) {
        throw e;
    }
};

export const createDocumentTaskQueue = async ({
    documents,
    address,
    client,
    currentWallet,
    companyName,
}) => {
    try {
        for (let index = 0; index < documents.length; index++) {
            let document = documents[index];
            document = deepMap(document, unsalt);
            try {
                let createdDocument = {};
                for (const key in document) {
                    let currentField = document[key];
                    if (key === "fileName") {
                        let specialVar = checkForSpecialChar({ currentField });
                        let lengthVar = checkLengthOfInput(currentField);
                        if (!lengthVar?.valid) {
                            throw VERIFIER_ERROR_CODE.FILENAME_IS_TOO_SHORT;
                        }
                        if (!specialVar?.valid) {
                            throw VERIFIER_ERROR_CODE.STRING_INCLUDE_SPECIAL_CHARATERS;
                        }
                        let endWithSpecialCharacters =
                            checkForStringEndWithSpecialCharacters(
                                currentField
                            );
                        if (!endWithSpecialCharacters?.valid) {
                            throw VERIFIER_ERROR_CODE.END_WITH_SPECIAL_CHARACTER;
                        }
                        if (!nonIsoValidator(currentField)) {
                            throw VERIFIER_ERROR_CODE.STRING_INCLUDE_SPECIAL_CHARATERS;
                        }
                    } else {
                        let lengthVar = checkRequirementOfInput(currentField);
                        if (!lengthVar?.valid) {
                            throw {
                                error_code: 400,
                                error_message: `${
                                    lengthVar?._key || key
                                } is required! Please check your input again!`,
                            };
                        }
                    }
                    if (key !== "did")
                        createdDocument = Object.assign(createdDocument, {
                            [key]: document[key],
                        });
                }
                createdDocument = Object.assign(createdDocument, {
                    companyName: companyName,
                    intention: VALID_DOCUMENT_NAME_TYPE.find(
                        (prop) => prop.name === createdDocument.name
                    ).type,
                });
                const did = generateDid(companyName, address);
                let res = await createWrappedDocument(
                    createdDocument,
                    SAMPLE_SERVICE,
                    address,
                    did
                );
                const { _document, targetHash } = res;
                const signMessage = await client
                    ?.newMessage(
                        getPublicKeyFromAddress(currentWallet?.paymentAddr),
                        Buffer.from(
                            JSON.stringify({
                                address: getPublicKeyFromAddress(
                                    currentWallet?.paymentAddr
                                ),
                                targetHash: targetHash,
                            })
                        ).toString("hex")
                    )
                    .sign();
                const wrappedDocument = wrapDocument({
                    document: _document,
                    walletAddress: address,
                    signedData: signMessage,
                    targetHash: targetHash,
                });
                return {
                    wrappedDocument,
                };
            } catch (e) {
                throw (
                    e ||
                    e?.error_message ||
                    "Something went wrong! Please try again later."
                );
            }
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Function employed for retrieving the endorsement chain from the DID Controller.
 * @param {String} did - did of document which is used for getting endorsement chain
 * @param {String} accessToken - access token of current user
 * @returns {Promise<Array>} - Promise object includes array of endorsement chain
 */
export const fetchEndorsementChain = async ({ did, accessToken }) => {
    try {
        const documentContentResponse = await ControllerService(
            accessToken
        ).getDocumentContent({
            did: did,
        });
        if (!documentContentResponse?.data?.wrappedDoc?.mintingNFTConfig) {
            throw {
                ...ERRORS.CANNOT_UPDATE_DOCUMENT_INFORMATION,
                detail: "Cannot get minting config from document",
            };
        }
        const policyId =
            documentContentResponse?.data?.wrappedDoc?.mintingNFTConfig?.policy
                ?.id;
        const getNftResponse = await CardanoService(accessToken).getToken({
            policyId,
        });
        const nftContracts = getNftResponse?.data?.data;
        const retrieveCertificatePromises = nftContracts.map(async (nft) => {
            const certificateDid = getDidByComponents(
                nft?.onchainMetadata?.did
            );
            const certificateResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did: certificateDid,
            });
            const didDocumentResponse = await ControllerService(
                accessToken
            ).getDocumentDid({
                did: certificateDid,
            });
            return {
                data: { ...certificateResponse?.data?.wrappedDoc?.data },
                signature: {
                    ...certificateResponse?.data?.wrappedDoc?.signature,
                },
                timestamp: nft?.onchainMetadata?.timestamp,
                url: didDocumentResponse?.data?.didDoc.pdfUrl,
            };
        });
        const data = await Promise.all(retrieveCertificatePromises);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Function used for indicate that it checks if the input object is the latest version
 * @param {String} currentHash - current hash of document
 * @param {Array} endorsementChain - array of endorsement chain
 * @returns {Promise<Boolean>} - Promise object includes boolean value
 */
export const isLastestCertificate = async ({
    currentHash,
    endorsementChain,
}) => {
    try {
        const requireField = "timestamp";
        const validRequirement = requireFieldInArray(
            endorsementChain,
            "timestamp"
        );
        if (!validRequirement) {
            throw {
                ...MISSING_REQUIRED_PARAMETERS,
                detail: `Missing ${requireField} in endorsement chain`,
            };
        }
        const sortedEndorsementChain = endorsementChain.sort(
            (a, b) => b.timestamp - a.timestamp
        );
        const lastestCertificate = sortedEndorsementChain[0];
        const lastestCertificateHash =
            lastestCertificate?.signature?.targetHash;
        if (lastestCertificateHash !== currentHash) {
            return {
                valid: false,
                verifier_message:
                    "This is not the latest version of the document",
            };
        }
        return {
            valid: true,
            verifier_message: "This is the latest version of the document",
        };
    } catch (error) {
        throw error;
    }
};
