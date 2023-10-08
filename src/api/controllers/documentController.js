// * Constants
import { SERVERS, REQUEST_TYPE } from "../../config/constants.js";
import { ERRORS } from "../../config/errors/error.constants.js";

// * Utilities
import axios from "axios";
import fs from "fs";
import { sha256 } from "js-sha256";
import "dotenv/config";
import {
    checkUndefinedVar,
    getCurrentDateTime,
    getPublicKeyFromAddress,
    generateRandomString,
    validateDID,
} from "../utils/index.js";
import {
    createDocumentForCommonlands,
    hashDocumentContent,
    isLastestCertificate,
    fetchEndorsementChain,
    createDocumentTaskQueue,
} from "../utils/document.js";
import FormData from "form-data";
import { getAccountBySeedPhrase } from "../utils/lucid.js";
import {
    getDocumentContentByDid,
    updateDocumentDid,
    getDidDocumentByDid,
} from "../utils/controller.js";
import { createVerifiableCredential } from "../utils/credential.js";
import {
    createOwnerCertificate,
    encryptPdf,
    getPdfBufferFromUrl,
    bufferToPDFDocument,
    deleteFile,
} from "../utils/pdf.js";
import { deepUnsalt, unsalt } from "../../fuixlabs-documentor/utils/data.js";
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import logger from "../../../logger.js";
import {
    AuthHelper,
    CardanoHelper,
    ControllerHelper,
    TaskQueueHelper,
    VerifiableCredentialHelper,
} from "../../helpers/index.js";

axios.defaults.withCredentials = true;

export default {
    getDocument: async (req, res, next) => {
        try {
            const { did } = req.params;
            const undefinedVar = checkUndefinedVar({
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken = await AuthHelper.authenticationProgress();
            const didDocumentResponse = await getDidDocumentByDid({
                did: did,
                accessToken: accessToken,
            });
            if (didDocumentResponse?.error_code) {
                return next(
                    didDocumentResponse || ERRORS.CANNOT_GET_DID_DOCUMENT
                );
            }
            const url = didDocumentResponse?.didDoc?.pdfUrl;
            if (!url) {
                return next(ERRORS.CANNOT_GET_CONTRACT_URL);
            }
            const docContentResponse = await getDocumentContentByDid({
                did: did,
                accessToken: accessToken,
            });
            if (docContentResponse?.error_code) {
                return next(
                    docContentResponse || ERRORS.CANNOT_GET_DOCUMENT_INFORMATION
                );
            }
            const hash = docContentResponse?.wrappedDoc?.signature?.targetHash;
            return res.status(200).json({
                success: true,
                url: url,
                hash: hash,
                did: did,
            });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    createPlotCertification: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Create Plot Certification`);
            const { plot } = req.body;
            const undefinedVar = checkUndefinedVar({
                plot,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const plotCertificationFileName = `PlotCertification-${plot?._id}`;
            const companyName = process.env.COMPANY_NAME;
            logger.apiInfo(
                req,
                res,
                `Pdf file name: ${plotCertificationFileName}`
            );
            const accessToken = await AuthHelper.authenticationProgress();
            const isExistedResponse = await ControllerHelper.isExisted({
                accessToken: accessToken,
                companyName: companyName,
                fileName: plotCertificationFileName,
            });
            if (isExistedResponse?.data?.isExisted) {
                logger.apiInfo(
                    req,
                    res,
                    `Document ${plotCertificationFileName} existed`
                );
                const existedDidDoc = await getDidDocumentByDid({
                    accessToken: accessToken,
                    did: generateDid(companyName, plotCertificationFileName),
                });
                if (existedDidDoc?.data?.error_code) {
                    return next(ERRORS?.CANNOT_FOUND_DID_DOCUMENT);
                }
                return res.status(200).json({
                    isExisted: true,
                });
            }
            let plotDetailForm = {
                profileImage: "sampleProfileImage",
                fileName: plotCertificationFileName,
                name: `Land Certificate`,
                title: `Land-Certificate-${plot?.name}`,
                No: generateRandomString(plot._id, 7),
                dateIssue: getCurrentDateTime(),
                plotInformation: {
                    plotName: plot?.name,
                    plotId: plot?.id,
                    plot_Id: plot?._id,
                    plotStatus: "Free & Clear",
                    plotPeople: "Verified by 3 claimants, 6 Neighbors",
                    plotLocation: plot?.placeName,
                    plotCoordinates: plot?.centroid?.join(","),
                    plotNeighbors: plot?.neighbors?.length,
                    plotClaimants: plot?.claimants?.length,
                    plotDisputes: plot?.disputes?.length,
                    plotStatus: plot?.status,
                },
                certificateByCommonlands: {
                    publicSignature: "commonlandsSignatureImage",
                    name: "Commonlands System LLC",
                    commissionNumber: "139668234",
                    commissionExpiries: "09/12/2030",
                },
                certificateByCEO: {
                    publicSignature: "ceoSignature",
                    name: "Darius Golkar",
                    commissionNumber: "179668234",
                    commissionExpiries: "09/12/2030",
                },
            };
            const { currentWallet, lucidClient } = await getAccountBySeedPhrase(
                {
                    seedPhrase: process.env.ADMIN_SEED_PHRASE,
                }
            );
            const { wrappedDocument } = await createDocumentTaskQueue({
                seedPhrase: process.env.ADMIN_SEED_PHRASE,
                documents: [plotDetailForm],
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                access_token: accessToken,
                client: lucidClient,
                currentWallet: currentWallet,
                companyName: companyName,
            });
            const documentDid = generateDid(
                companyName,
                unsalt(wrappedDocument?.data?.fileName)
            );
            if (!documentDid) {
                return next(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
            }
            await TaskQueueHelper.sendMintingRequest({
                data: {
                    wrappedDocument,
                    companyName,
                    did: documentDid,
                    plot,
                },
                type: REQUEST_TYPE.PLOT_MINT,
                did: documentDid,
            });
            const claimantsCredentialDids =
                await VerifiableCredentialHelper.getCredentialDidsFromClaimants(
                    {
                        claimants: plot?.claimants,
                        did: documentDid,
                        companyName,
                    }
                );
            return res.status(200).json(claimantsCredentialDids);
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    updatePlotCertification: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Update Plot Certification`);
            const { originalDid, plot } = req.body;
            const undefinedVar = checkUndefinedVar({
                originalDid,
                plot,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(originalDid);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken = await AuthHelper.authenticationProgress();
            const didContentResponse = await getDocumentContentByDid({
                accessToken: accessToken,
                did: originalDid,
            });
            if (didContentResponse?.error_code) {
                return next(
                    didContentResponse || ERRORS.CANNOT_GET_DOCUMENT_INFORMATION
                );
            }
            if (!didContentResponse?.wrappedDoc?.mintingNFTConfig) {
                return next({
                    ...ERRORS.CANNOT_UPDATE_DOCUMENT_INFORMATION,
                    detail: "Cannot get minting config from document",
                });
            }
            const mintingConfig = {
                ...didContentResponse?.wrappedDoc?.mintingNFTConfig,
            };
            mintingConfig.policy = {
                ...mintingConfig.policy,
                reuse: true,
            };
            logger.apiInfo(
                req,
                res,
                `Minting config: ${JSON.stringify(mintingConfig)}`
            );
            const plotCertificationFileName = `PlotCertification-${plot?._id}`;
            const companyName = process.env.COMPANY_NAME;
            logger.apiInfo(
                req,
                res,
                `Pdf file name: ${plotCertificationFileName}`
            );
            const isExistedResponse = await axios.get(
                SERVERS.DID_CONTROLLER + "/api/doc/exists",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${accessToken}`,
                    },
                    params: {
                        companyName: companyName,
                        fileName: plotCertificationFileName,
                    },
                }
            );
            if (isExistedResponse?.data?.isExisted) {
                logger.apiInfo(
                    req,
                    res,
                    `Document ${plotCertificationFileName} existed`
                );
                const existedDidDoc = await getDidDocumentByDid({
                    accessToken: accessToken,
                    did: generateDid(companyName, plotCertificationFileName),
                });
                if (existedDidDoc?.data?.error_code) {
                    return next(ERRORS?.CANNOT_FOUND_DID_DOCUMENT);
                }
                logger.apiInfo(
                    req,
                    res,
                    `Pdf url of existed document: ${existedDidDoc?.didDoc?.pdfUrl}`
                );
                return res.status(200).json({
                    url: existedDidDoc?.didDoc?.pdfUrl,
                    isExisted: true,
                });
            }
            let plotDetailForm = {
                profileImage: "sampleProfileImage",
                fileName: plotCertificationFileName,
                name: `Land Certificate`,
                title: `Land-Certificate-${plot?.name}`,
                No: generateRandomString(plot._id, 7),
                dateIssue: getCurrentDateTime(),
                plotInformation: {
                    plotName: plot?.name,
                    plotId: plot?.id,
                    plot_Id: plot?._id,
                    plotStatus: "Free & Clear",
                    plotPeople: "Verified by 3 claimants, 6 Neighbors",
                    plotLocation: plot?.placeName,
                    plotCoordinates: plot?.centroid?.join(","),
                    plotNeighbors: plot?.neighbors?.length,
                    plotClaimants: plot?.claimants?.length,
                    plotDisputes: plot?.disputes?.length,
                    plotStatus: plot?.status,
                },
                certificateByCommonlands: {
                    publicSignature: "commonlandsSignatureImage",
                    name: "Commonlands System LLC",
                    commissionNumber: "139668234",
                    commissionExpiries: "09/12/2030",
                },
                certificateByCEO: {
                    publicSignature: "ceoSignature",
                    name: "Darius Golkar",
                    commissionNumber: "179668234",
                    commissionExpiries: "09/12/2030",
                },
            };
            const { currentWallet, lucidClient } = await getAccountBySeedPhrase(
                {
                    seedPhrase: process.env.ADMIN_SEED_PHRASE,
                }
            );
            const { wrappedDocument } = await createDocumentForCommonlands({
                seedPhrase: process.env.ADMIN_SEED_PHRASE,
                documents: [plotDetailForm],
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                access_token: accessToken,
                client: lucidClient,
                currentWallet: currentWallet,
                companyName: companyName,
                mintingConfig: mintingConfig,
            });
            const documentDid = generateDid(
                companyName,
                unsalt(wrappedDocument?.data?.fileName)
            );
            if (!documentDid) {
                return next(ERRORS.CANNOT_GET_DOCUMENT_INFORMATION);
            }
            const updateMintingConfig = wrappedDocument?.mintingNFTConfig;
            logger.apiInfo(
                req,
                res,
                `Wrapped document ${JSON.stringify(wrappedDocument)}`
            );
            const claimants = plot?.claimants;
            const promises = claimants.map(async (claimant) => {
                const { credential } = await createVerifiableCredential({
                    metadata: claimant,
                    did: documentDid,
                    subject: {
                        object: documentDid,
                        action: {
                            code: 1,
                            proofHash: documentHash,
                        },
                    },
                    signData: {
                        key: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                        signature: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                    },
                    issuerKey: documentDid,
                });
                const verifiedCredential = {
                    ...credential,
                    timestamp: Date.now(),
                };
                const credentialHash = sha256(
                    Buffer.from(
                        JSON.stringify(verifiedCredential),
                        "utf8"
                    ).toString("hex")
                );
                const credentialResponse = await axios.post(
                    SERVERS.CARDANO_SERVICE + "/api/v2/credential",
                    {
                        config: updateMintingConfig,
                        credential: credentialHash,
                    },
                    {
                        withCredentials: true,
                        headers: {
                            Cookie: `access_token=${accessToken};`,
                        },
                    }
                );
                if (credentialResponse?.data?.code !== 0) {
                    return next({
                        ...ERRORS.CREDENTIAL_FAILED,
                        detail: credentialResponse?.data,
                    });
                }
                const storeCredentialStatus = await axios.post(
                    SERVERS.DID_CONTROLLER + "/api/credential",
                    {
                        hash: credentialHash,
                        content: {
                            ...verifiedCredential,
                            mintingNFTConfig: credentialResponse?.data?.data,
                        },
                    },
                    {
                        headers: {
                            Cookie: `access_token=${accessToken};`,
                        },
                    }
                );
                if (storeCredentialStatus?.data?.error_code) {
                    return next(storeCredentialStatus?.data);
                }
                return credentialHash;
            });
            Promise.all(promises)
                .then((data) => {
                    return res.status(200).json({
                        credentials: data,
                        certificateDid: documentDid,
                    });
                })
                .catch((error) => {
                    return next({
                        ...error,
                        detail: "Cannot get certificate from claimant!",
                    });
                });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    getPlotCertification: async (req, res, next) => {
        try {
            const { did } = req.params;
            const undefinedVar = checkUndefinedVar({
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken = await AuthHelper.authenticationProgress();
            const didDocumentResponse = await getDidDocumentByDid({
                did: did,
                accessToken: accessToken,
            });
            if (didDocumentResponse?.error_code) {
                return next(
                    didDocumentResponse || ERRORS.CANNOT_GET_DID_DOCUMENT
                );
            }
            const url = didDocumentResponse?.didDoc?.pdfUrl;
            if (!url) {
                return next(ERRORS.CANNOT_GET_CONTRACT_URL);
            }
            return res.status(200).json({
                success: true,
                url: url,
            });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    hashDocument: async (req, res, next) => {
        try {
            const { plot, claimant } = req.body;
            const undefinedVar = checkUndefinedVar({
                plot,
                claimant,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const pdfFileName =
                `LandCertificate-${claimant?.phoneNumber?.replace("+", "")}-${
                    plot?._id
                }` || "";
            const plotDetailForm = {
                profileImage: "sampleProfileImage",
                fileName: pdfFileName,
                name: `Land Certificate`,
                title: `Land-Certificate-${plot?.name || ""}`,
                No: plot?.no || "CML21566325",
                dateIssue: getCurrentDateTime(),
                personalInformation: {
                    claimant: claimant?.fullName || "",
                    right: claimant?.role || "",
                    phoneNumber: claimant?.phoneNumber || "",
                    claimrank: "okay",
                    description:
                        "Okay is the starting point. This level may have some boundaries unverified and may include one boundary dispute. If there is an ownership dispute of a plot but and one of the owners is part of a claimchain and the other’s has not completed a claimchain, the completed claimchain person will be listed as Okay. ",
                },
                plotInformation: {
                    plotName: plot?.name || "",
                    plotId: plot?.id || "",
                    plotStatus: "Free & Clear",
                    plotPeople: "Verified by 3 claimants, 6 Neighbors",
                    plotLocation: plot?.placeName || "",
                },
                certificateByCommonlands: {
                    name: "Commonlands System LLC",
                },
                certificateByCEO: {
                    name: "Darius Golkar",
                },
            };
            const { currentWallet } = await getAccountBySeedPhrase({
                seedPhrase: process.env.ADMIN_SEED_PHRASE,
            });

            const targetHash = await hashDocumentContent({
                document: plotDetailForm,
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
            });
            logger.apiInfo(req, res, `Hash of document: ${targetHash}`);
            return res.status(200).json({
                targetHash,
            });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    getEndorsementChainOfCertificate: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Get Endorsement Chain`);
            const { did } = req.params;
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken = await AuthHelper.authenticationProgress();
            const endorsementChain = await fetchEndorsementChain({
                did: did,
                accessToken: accessToken,
            });
            return res.status(200).json(endorsementChain);
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    checkLastestVersion: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Check Lastest Version`);
            const { did, hash } = req.body;
            const undefinedVar = checkUndefinedVar({
                hash,
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken = await AuthHelper.authenticationProgress();
            const endorsementChain = await fetchEndorsementChain({
                did: did,
                accessToken: accessToken,
            });
            const isLastest = await isLastestCertificate({
                currentHash: hash,
                endorsementChain: endorsementChain,
            });
            return res.status(200).json(isLastest);
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    verifyCertificateQrCode: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, `API Request: Verify Certificate Qr Code`);
            const { hash, did } = req.query;
            const undefinedVar = checkUndefinedVar({
                hash,
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken = await AuthHelper.authenticationProgress();
            const endorsementChain = await fetchEndorsementChain({
                did: did,
                accessToken: accessToken,
            });
            const verifierPromises = [
                await isLastestCertificate({
                    currentHash: hash,
                    endorsementChain: endorsementChain,
                }),
            ];
            Promise.allSettled(verifierPromises)
                .then((data) => {
                    const notPassVerifiers = data.filter(
                        (obj) => obj?.value?.valid === false
                    );
                    if (notPassVerifiers?.length === 0) {
                        logger.apiInfo(
                            req,
                            res,
                            `Verified successfully! ${did} is valid!`
                        );
                        return res.status(200).json({
                            success: true,
                            success_message: "Verified successfully!",
                            isValid: true,
                        });
                    }
                    return next({
                        ...ERRORS.CERTIFICATE_IS_NOT_VALID,
                        detail: notPassVerifiers
                            .map((obj) => obj?.value?.verifier_message)
                            .join("; "),
                    });
                })
                .catch((error) => {
                    return next(error);
                });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
};
