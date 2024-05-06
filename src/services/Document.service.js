import { getAccountBySeedPhrase, signData } from "../utils/lucid.js";
import {
    getPublicKeyFromAddress,
    generateRandomString,
} from "../utils/index.js";
import ControllerService from "./Controller.service.js";
import { generateDid } from "../fuixlabs-documentor/utils/did.js";
import { deepMap } from "../fuixlabs-documentor/utils/salt.js";
import {
    checkForSpecialChar,
    checkLengthOfInput,
    checkForStringEndWithSpecialCharacters,
    nonIsoValidator,
    checkRequirementOfInput,
    unsalt,
} from "../fuixlabs-documentor/utils/data.js";
import {
    createWrappedDocument,
    wrapDocument,
} from "../fuixlabs-documentor/utils/document.js";
import { env, WRAPPED_DOCUMENT_TYPE } from "../configs/constants.js";
import { VERIFIER_ERROR_CODE } from "../fuixlabs-documentor/constants/error.js";
import {
    VALID_DOCUMENT_NAME_TYPE,
    SAMPLE_SERVICE,
} from "../fuixlabs-documentor/constants/type.js";
import { AppError } from "../configs/errors/appError.js";
import { ERRORS } from "../configs/errors/error.constants.js";
import cardanoService from "./Cardano.service.js";
import stellarService from "./Stellar.service.js";

/**
 * Wraps document data with additional information and creates a wrapped document.
 * @param {Object} options - The options object.
 * @param {Array} options.documents - The array of documents to be wrapped.
 * @param {string} options.address - The address associated with the document.
 * @param {Object} options.client - The client object.
 * @param {string} options.currentWallet - The current wallet.
 * @param {string} options.companyName - The name of the company.
 * @returns {Object} The wrapped document.
 * @throws {Error} If an error occurs during the wrapping process.
 */
const wrapDocumentData = async (
    { documents, address, companyName },
    network = "stellar"
) => {
    try {
        for (let index = 0; index < documents.length; index++) {
            let document = documents[index];
            document = deepMap(document, unsalt);
            try {
                let createdDocument = {};
                for (const key in document) {
                    let currentField = document[key];
                    if (key === "fileName") {
                        let specialVar = checkForSpecialChar({
                            currentField,
                        });
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
                            throw new AppError({
                                error_code: 400,
                                error_message: `${
                                    lengthVar?._key || key
                                } is required! Please check your input again!`,
                            });
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
                let signMessage;
                if (network === "stellar") {
                    signMessage = await stellarService.sign({
                        address: address,
                        targetHash: targetHash,
                    });
                } else if (network === "cardano") {
                    const paymentAddr =
                        await cardanoService.getPaymentAddress();
                    signMessage = await cardanoService.sign({
                        address: paymentAddr,
                        targetHash: targetHash,
                    });
                }
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
 * Validates the document type.
 *
 * @param {string} type - The document type to validate.
 * @returns {boolean} - Returns true if the document type is valid, otherwise false.
 */
const validateDocumentType = (type) => {
    return !!VALID_DOCUMENT_NAME_TYPE.find((prop) => prop.name === type);
};

const DocumentService = () => {
    return {
        // ** SIGNATURE FUNCTIONS ** \\
        /**
         * Signs the provided issue data with Cardano.
         *
         * @param {Object} issueData - The data to be signed.
         * @param {string} companyName - The name of the company.
         * @returns {Promise<Object>} - The wrapped document.
         * @throws {Error} - If an error occurs during the signing process.
         */
        async signDataWithCardano(issueData, companyName) {
            try {
                const { currentWallet, lucidClient } =
                    await getAccountBySeedPhrase({
                        seedPhrase: env.CARDANO_SEED_PHRASE,
                    });
                const { wrappedDocument } = await wrapDocumentData(
                    {
                        seedPhrase: env.CARDANO_SEED_PHRASE,
                        documents: [issueData],
                        address: getPublicKeyFromAddress(
                            currentWallet?.paymentAddr
                        ),
                        client: lucidClient,
                        currentWallet: currentWallet,
                        companyName: companyName,
                    },
                    "cardano"
                );
                return {
                    wrappedDocument,
                };
            } catch (error) {
                throw error;
            }
        },

        /**
         * Signs the provided issueData with Stellar.
         *
         * @param {Object} issueData - The data to be signed.
         * @param {string} companyName - The name of the company.
         * @returns {Promise<Object>} - The wrapped document containing the signed data.
         * @throws {Error} - If an error occurs during the signing process.
         */
        async signDataWithStellar(issueData, companyName) {
            try {
                const address = stellarService.getPublicKey();
                const { wrappedDocument } = await wrapDocumentData(
                    {
                        seedPhrase: env.CARDANO_SEED_PHRASE,
                        documents: [issueData],
                        address,
                        currentWallet: currentWallet,
                        companyName: companyName,
                    },
                    "stellar"
                );
                return {
                    wrappedDocument,
                };
            } catch (error) {
                throw error;
            }
        },

        /**
         * Generates a file name for a document based on the provided data and type.
         *
         * @param {Object} data - The data object for the document.
         * @param {string} type - The type of the document.
         * @param {boolean} [update=false] - Indicates whether the document is being updated.
         * @returns {Object} - An object containing the generated file name.
         * @throws {AppError} - If the input type is invalid.
         */
        generateFileNameForDocument(data, type, update = false) {
            const response = {
                fileName: "",
            };
            switch (type) {
                case WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT: {
                    const fileName = `LoanContract_${data._id || data.id}`;
                    response.fileName = fileName;
                    break;
                }
                case WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE: {
                    let fileName;
                    if (update) {
                        fileName = `PlotCertification_${
                            data?._id
                        }-${generateRandomString(data._id, 5)}`;
                    } else {
                        fileName = `PlotCertification_${data?._id}`;
                    }
                    response.fileName = fileName;
                    break;
                }
                default:
                    throw new AppError(ERRORS.INVALID_INPUT);
            }
            return response;
        },

        /**
         * Issues and signs a document by an admin.
         * @param {Object} issueData - The data of the document to be issued.
         * @param {string} companyName - The name of the company issuing the document.
         * @returns {Promise<Object>} - The wrapped document.
         * @throws {Error} - If an error occurs during the process.
         */
        async issueBySignByAdmin(issueData, companyName, network = "stellar") {
            if (network === "cardano") {
                return await this.signDataWithCardano(issueData, companyName);
            } else if (network === "stellar") {
                return await this.signDataWithStellar(issueData, companyName);
            }
        },

        /**
         * Creates wrapped document data.
         *
         * @param {string} fileName - The name of the file.
         * @param {object} data - The data object.
         * @param {string} type - The type of the document.
         * @returns {object} The created data form.
         * @throws {AppError} If the document type is not valid.
         */
        async createWrappedDocumentData(fileName, data, type) {
            const isValidType = validateDocumentType(type);
            if (!isValidType) {
                throw new AppError(
                    ERRORS.DOCUMENT_TYPE_IS_NOT_VALID,
                    "Invalid type of document"
                );
            }
            try {
                const dataForm = {
                    fileName,
                    name: type,
                    title: `${type}-${data._id}`,
                };
                return dataForm;
            } catch (error) {
                throw error;
            }
        },

        /**
         * Retrieves the endorsement chain for a given DID.
         *
         * @param {string} did - The DID (Decentralized Identifier) to retrieve the endorsement chain for.
         * @returns {Promise<Array<Object>>} - A promise that resolves to an array of certificate objects representing the endorsement chain.
         * @throws {AppError} - If there is an error retrieving the endorsement chain.
         */
        async getEndorsementChainByDid(did) {
            try {
                const documentContentResponse =
                    await ControllerService().getDocumentContent({
                        did: did,
                    });
                if (
                    !documentContentResponse?.data?.wrappedDoc?.mintingNFTConfig
                ) {
                    throw new AppError(
                        ERRORS.CANNOT_UPDATE_DOCUMENT_INFORMATION,
                        "Cannot get minting config from document"
                    );
                }
                const policyId =
                    documentContentResponse?.data?.wrappedDoc?.mintingNFTConfig
                        ?.policy?.id;
                const getNftResponse = await CardanoService().getToken({
                    policyId,
                });
                const nftContracts = getNftResponse?.data?.data;
                const retrieveCertificatePromises = nftContracts.map(
                    async (nft) => {
                        const certificateDid = getDidByComponents(
                            nft?.onchainMetadata?.did
                        );
                        const certificateResponse =
                            await ControllerService().getDocumentContent({
                                did: certificateDid,
                            });
                        const didDocumentResponse =
                            await ControllerService().getDocumentDid({
                                did: certificateDid,
                            });
                        return {
                            data: {
                                ...certificateResponse?.data?.wrappedDoc?.data,
                            },
                            signature: {
                                ...certificateResponse?.data?.wrappedDoc
                                    ?.signature,
                            },
                            timestamp: nft?.onchainMetadata?.timestamp,
                            url: didDocumentResponse?.data?.didDoc.pdfUrl,
                        };
                    }
                );
                const data = await Promise.all(retrieveCertificatePromises);
                return data;
            } catch (error) {
                throw error;
            }
        },

        /**
         * Checks if the given document hash matches the hash of the latest certificate in the endorsement chain.
         * @param {string} currentHash - The hash of the current document.
         * @param {Array} endorsementChain - The endorsement chain containing certificates.
         * @returns {Object} - An object indicating whether the document is valid and a verifier message.
         * @throws {AppError} - If the endorsement chain is missing the required field.
         */
        async checkLastestCertificate(currentHash, endorsementChain) {
            try {
                const requireField = "timestamp";
                const validRequirement = requireFieldInArray(
                    endorsementChain,
                    "timestamp"
                );
                if (!validRequirement) {
                    throw new AppError({
                        ...MISSING_REQUIRED_PARAMETERS,
                        detail: `Missing ${requireField} in endorsement chain`,
                    });
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
                    verifier_message:
                        "This is the latest version of the document",
                };
            } catch (error) {
                throw error;
            }
        },
    };
};
const documentService = DocumentService();
export default DocumentService;
export { documentService };
