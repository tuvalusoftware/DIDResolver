import axios from "axios";
import bs58 from "bs58";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import CardanoService from "../../../services/Cardano.service.js";
import DocumentService from "../../../services/Document.service.js";
import ControllerService from "../../../services/Controller.service.js";
import { getAccountBySeedPhrase } from "../../../utils/lucid.js";
import { asyncWrapper } from "../../middlewares/async.js";
import credentialService from "../../../services/VerifiableCredential.service.js";
import dotenv from "dotenv";
import { createRequire } from "module";
import { fileURLToPath } from "node:url";
import Logger from "../../../libs/logger.js";
import {
    AppError
} from '../../../configs/errors/appError.js'
import {
    ERRORS
} from '../../../configs/errors/error.constants.js';

import {
    rabbitMQ
} from '../../../rabbit/index.js'
import {
    RABBITMQ_SERVICE
} from '../../../rabbit/config.js'
import { randomUUID } from "crypto";

// * Constants
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import wrappedDocumentSchema from "../../../configs/schemas/wrappedDocument.schema.js";

axios.defaults.withCredentials = true;

dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const logger = Logger(__filename);

export default {
    createContract: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Create contract v1");
        const { wrappedDoc, metadata } = schemaValidator(
            requestSchema.createContract,
            req.body
        );
        const companyName = env.COMPANY_NAME;
        const { fileName } = DocumentService().generateFileNameForDocument(
            wrappedDoc,
            WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT
        );
        const did = generateDid(companyName, fileName);
        const isExistedResponse = await ControllerService().isExisted({
            companyName,
            fileName,
        });
        if (isExistedResponse.data?.isExisted) {
            const getDocumentResponse =
                await ControllerService().getDocumentContent({
                    did,
                });
            const { wrappedDoc } = getDocumentResponse?.data;
            return {
                isExisted: true,
                wrappedDocument: wrappedDoc,
            };
        }
        const { dataForm } = await DocumentService().createWrappedDocumentData(
            fileName,
            wrappedDoc,
            WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT
        );
        schemaValidator(wrappedDocumentSchema.dataForIssueDocument, dataForm);
        const { wrappedDocument } = await DocumentService().issueBySignByAdmin(
            dataForm,
            companyName
        );
        const request = await RequestRepo.createRequest({
            data: {
                wrappedDocument,
                metadata,
            },
            type: REQUEST_TYPE.MINTING_TYPE.createContract,
            status: "pending",
        });
        await CardanoService().storeToken({
            hash: wrappedDocument?.signature?.targetHash,
            id: request._id,
            type: "document",
        });
        return res.status(200).json({
            did,
        });
    }),
    getContract: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Get contract v1");
        const { did } = schemaValidator(requestSchema.did, req.params);
        const docContentResponse = await ControllerService().getDocumentContent(
            {
                did: did,
            }
        );
        const { targetHash } = docContentResponse?.data?.wrappedDoc?.signature;
        return res.status(200).json({
            hash: targetHash,
            did,
        });
    }),
    signContract: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Sign contract v1");
        const { contract, claimant, role } = schemaValidator(
            requestSchema.signContractWithClaimant,
            req.body
        );
        const { certificateDid, seedPhrase, userDid } = claimant;
        const companyName = env.COMPANY_NAME;
        const { currentWallet } = await getAccountBySeedPhrase({
            seedPhrase,
        });
        const userPrivateKey = bs58.encode(
            currentWallet?.paymentKey.as_bytes()
        );
        const userPublicKey = bs58.encode(
            currentWallet?.paymentKeyPub.as_bytes()
        );

        const { verifiableCredential, credentialHash } =
            await credentialService.createContractVerifiableCredential({
                subject: {
                    userDid,
                    contractDid: contract,
                    certificateDid,
                    role,
                },
                issuerKey: contract,
                privateKey: userPrivateKey,
                publicKey: userPublicKey,
            });
        const verifiedCredential = {
            ...verifiableCredential,
        };
        const credentialDid = generateDid(companyName, credentialHash);
        const request = await RequestRepo.createRequest({
            data: {
                credential: credentialHash,
                verifiedCredential,
                companyName,
                originDid: contract,
            },
            type: REQUEST_TYPE.MINTING_TYPE.signContract,
            status: "pending",
        });
        return res.status(200).json({
            did: credentialDid,
        });
    }),
    updateContract: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Update contract v1");
        const { did, metadata } = schemaValidator(
            requestSchema.updateContract,
            req.body
        );
        const didDocumentResponse = await ControllerService().getDocumentDid({
            did,
        });
        const originDidDocument = didDocumentResponse?.data?.didDoc;
        await ControllerService().updateDocumentDid({
            did,
            didDoc: {
                ...originDidDocument,
                meta_data: metadata,
            },
        });
        return res.status(200).json({
            updated: true,
        });
    }),
    signContractHistory: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Create contract history v1");

        const { contract, seedPhrase, userDid } = schemaValidator(
            requestSchema.createContractHistory,
            req.body
        );

        const { currentWallet } = await getAccountBySeedPhrase({
            seedPhrase,
        });
        const userPrivateKey = bs58.encode(
            currentWallet?.paymentKey.as_bytes()
        );
        const userPublicKey = bs58.encode(
            currentWallet?.paymentKeyPub.as_bytes()
        );

        const { verifiableCredential, credentialHash } =
            await credentialService.createContractVerifiableCredential({
                subject: {
                    userDid,
                    contractDid: contract,
                    certificateDid: "did:cardano:meo:dsadsadsadasd",
                    role: "renter",
                },
                issuerKey: contract,
                privateKey: userPrivateKey,
                publicKey: userPublicKey,
            });

        const companyName = env.COMPANY_NAME;

        const credentialDid = generateDid(companyName, credentialHash);

        const documentContentResponse =
            await ControllerService().getDocumentContent({
                did: contract,
            });
        if (
            !documentContentResponse.data?.wrappedDoc
                ?.mintingConfig
        ) {
            logger.error(
                `There are no mintingConfig in request ${request._id}`
            );
            throw new AppError(ERRORS.INVALID_INPUT);
        }
        const { mintingConfig } =
            documentContentResponse.data.wrappedDoc;

        const credentialChannel = await rabbitMQ.createChannel();
        const correlationId = randomUUID();
        const replyQueue = await credentialChannel.assertQueue(correlationId, {
            durable: true,
            noAck: true,
        });

        const request = await RequestRepo.createRequest({
            data: {
                credential: credentialHash,
                verifiedCredential: verifiableCredential,
                companyName,
                originDid: contract,
            },
            type: REQUEST_TYPE.MINTING_TYPE.createContractHistory,
            status: "pending",
        });

        const requestMessage = {
            data: {
                config: mintingConfig,
                credentials: [credentialHash],
                type: "credential",
            },
            options: {
                skipWait: true,
            },
            type: REQUEST_TYPE.CARDANO_SERVICE.mintCredential,
            id: request._id.toString(),
        }

        credentialChannel.sendToQueue(
            RABBITMQ_SERVICE.CardanoContractService,
            Buffer.from(JSON.stringify(requestMessage)),
            {
                correlationId,
                replyTo: correlationId,
            }
        );

        const createClaimantCredentialHandle = new Promise(
            (resolve, reject) => {
                credentialChannel.consume(replyQueue.queue, async (msg) => {
                    if (msg !== null) {
                        const cardanoResponse = JSON.parse(msg.content);
                        const config = cardanoResponse.data;
                        if (cardanoResponse.id === request._id.toString()) {
                            const { originDid, credential } = request.data;
                            const documentContentResponse =
                                await ControllerService().getDocumentContent({
                                    did: originDid,
                                });
                            if (
                                !documentContentResponse.data?.wrappedDoc
                                    ?.mintingConfig
                            ) {
                                logger.error(
                                    `There are no mintingConfig in request ${request._id}`
                                );
                                throw new AppError(ERRORS.INVALID_INPUT);
                            }
                            const { mintingConfig } = documentContentResponse.data.wrappedDoc;

                            await CardanoService().storeCredentialsWithPolicyId(
                                {
                                    credentials: [credential],
                                    mintingConfig,
                                    id: request._id,
                                }
                            );
                            await RequestRepo.findOneAndUpdate(
                                { status: "completed" },
                                { _id: request._id }
                            );
                            resolve({
                                txHash: cardanoResponse.data.txHash
                            });
                        }
                        credentialChannel.ack(msg);
                    }
                });
            }
        );

        const {
            txHash
        } = await createClaimantCredentialHandle;

        credentialChannel.close();

        return res.status(200).json({
            did: credentialDid,
            txHash
        });

    }),
};
