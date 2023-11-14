import { getAccountBySeedPhrase } from "../utils/lucid.js";
import {
    getPublicKeyFromAddress,
    getCurrentDateTime,
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

// * Constants
import { env, WRAPPED_DOCUMENT_TYPE } from "../configs/constants.js";
import { VERIFIER_ERROR_CODE } from "../fuixlabs-documentor/constants/error.js";
import {
    VALID_DOCUMENT_NAME_TYPE,
    SAMPLE_SERVICE,
    _DOCUMENT_TYPE,
} from "../fuixlabs-documentor/constants/type.js";
import { AppError } from "../configs/errors/appError.js";
import { ERRORS } from "../configs/errors/error.constants.js";

const adminSeedPhrase = env.ADMIN_SEED_PHRASE;

const { currentWallet, lucidClient } = await getAccountBySeedPhrase({
    seedPhrase: env.ADMIN_SEED_PHRASE,
});

const wrapDocumentData = async ({
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

const DocumentService = (accessToken) => {
    return {
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
                        fileName = `PlotCertification-${
                            data?._id
                        }-${generateRandomString(data._id, 5)}`;
                    } else {
                        fileName = `PlotCertification-${data?._id}`;
                    }
                    response.fileName = fileName;
                    break;
                }
                default:
                    throw new AppError(ERRORS.INVALID_INPUT);
            }
            return response;
        },

        async issueBySignByAdmin(issueData, companyName) {
            try {
                const { currentWallet, lucidClient } =
                    await getAccountBySeedPhrase({
                        seedPhrase: env.ADMIN_SEED_PHRASE,
                    });
                const { wrappedDocument } = await wrapDocumentData({
                    seedPhrase: env.ADMIN_SEED_PHRASE,
                    documents: [issueData],
                    address: getPublicKeyFromAddress(
                        currentWallet?.paymentAddr
                    ),
                    access_token: accessToken,
                    client: lucidClient,
                    currentWallet: currentWallet,
                    companyName: companyName,
                });
                return {
                    wrappedDocument,
                };
            } catch (error) {
                throw error;
            }
        },

        async createWrappedDocumentData(fileName, data, type) {
            try {
                const currentDate = getCurrentDateTime();
                switch (type) {
                    case WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT: {
                        const dataForm = {
                            fileName,
                            name: WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT,
                            title: `${WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT}-${data._id}`,
                            dateIssue: currentDate,
                        };
                        return {
                            dataForm,
                        };
                    }
                    case WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE: {
                        const dataForm = {
                            fileName: fileName,
                            name: WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE,
                            title: `${WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE}-${data.name}`,
                            dateIssue: currentDate,
                            plotInformation: {
                                plotName: data.name,
                                plotId: data.id,
                                plot_Id: data._id,
                                plotStatus: data.status,
                                plotLocation: data.placeName,
                                plotCoordinates: data.centroid.join(","),
                                plotNeighbors: data.neighbors.length,
                                plotDisputes: data.disputes.length,
                            },
                        };
                        if (data.status) {
                            Object.assign(dataForm, { status: data.status });
                        }
                        return {
                            dataForm,
                        };
                    }
                    default:
                        throw new AppError(ERRORS.INVALID_INPUT);
                }
            } catch (error) {
                throw error;
            }
        },

        async getEndorsementChainByDid(did) {
            try {
                const documentContentResponse = await ControllerService(
                    accessToken
                ).getDocumentContent({
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
                const getNftResponse = await CardanoService(
                    accessToken
                ).getToken({
                    policyId,
                });
                const nftContracts = getNftResponse?.data?.data;
                const retrieveCertificatePromises = nftContracts.map(
                    async (nft) => {
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
                error;
            }
        },

        async checkLastestCertificate(currentHash, endorsementChain) {
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
                    verifier_message:
                        "This is the latest version of the document",
                };
            } catch (error) {
                throw error;
            }
        },
    };
};

export default DocumentService;
