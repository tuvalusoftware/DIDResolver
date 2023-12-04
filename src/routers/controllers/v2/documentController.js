import axios from "axios";
import "dotenv/config";
import RequestRepo from "../../../db/repos/requestRepo.js";
import {
    REQUEST_TYPE as RABBIT_REQUEST_TYPE,
    RABBITMQ_SERVICE,
} from "../../../rabbit/config.js";
import ControllerService from "../../../services/Controller.service.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import credentialService from "../../../services/VerifiableCredential.service.js";
import schemaValidator from "../../../helpers/validator.js";
import DocumentService from "../../../services/Document.service.js";
import { asyncWrapper } from "../../middlewares/async.js";
import ConsumerService from "../../../services/Consumer.service.js";
import { rabbitMQ } from "../../../rabbit/index.js";
import { randomUUID } from "crypto";
import { ERRORS } from "../../../configs/errors/error.constants.js";
import RabbitRepository from "../../../rabbit/rabbit.repository.js";
import { AppError } from "../../../configs/errors/appError.js";

// * Constants
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import wrappedDocumentSchema from "../../../configs/schemas/wrappedDocument.schema.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";

axios.defaults.withCredentials = true;

export default {
    createPlotCertification: asyncWrapper(async (req, res, next) => {
        const { plot } = schemaValidator(
            requestSchema.createCertificateForPlot,
            req.body
        );
        const companyName = env.COMPANY_NAME;
        const accessToken =
            env.NODE_ENV === "test"
                ? "mock-access-token"
                : await AuthenticationService().authenticationProgress();
        const { fileName } = DocumentService(
            accessToken
        ).generateFileNameForDocument(
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE
        );
        const did = generateDid(companyName, fileName);
        const isExistedResponse = await ControllerService().isExisted({
            companyName,
            fileName,
        });
        if (isExistedResponse.data?.isExisted) {
            const _documentContent =
                await ControllerService().getDocumentContent({
                    did,
                });
            const __txHash =
                _documentContent?.data?.wrappedDoc?.mintingConfig?.txHash;
            const _claimantsCredentialDids =
                await credentialService.getCredentialDidsFromClaimants({
                    claimants: plot.claimants,
                    did,
                    companyName,
                    plotId: plot._id,
                });
            const __claimants = [];
            for (const i of _claimantsCredentialDids.claimants) {
                const _credential =
                    await ControllerService().getCredentialContent({
                        did: i.did,
                    });
                __claimants.push({
                    userId: i.userId,
                    did: i.did,
                    transactionId: _credential.data.txHash,
                });
            }
            return res.status(200).json({
                plot: {
                    did,
                    transactionId: __txHash,
                },
                claimants: __claimants,
            });
        }
        const { dataForm } = await DocumentService(
            accessToken
        ).createWrappedDocumentData(
            fileName,
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE
        );
        schemaValidator(wrappedDocumentSchema.dataForIssueDocument, dataForm);
        const { wrappedDocument } = await DocumentService(
            accessToken
        ).issueBySignByAdmin(dataForm, companyName);
        const request = await RequestRepo.createRequest({
            data: {
                wrappedDocument,
                plot,
            },
            type: RABBIT_REQUEST_TYPE.MINTING_TYPE.createPlot,
            status: "pending",
        });
        const config = await ConsumerService().createDocument(
            wrappedDocument?.signature?.targetHash,
            request._id,
            "document",
            request
        );
        await RequestRepo.findOneAndUpdate(
            {
                response: config,
                status: "completed",
                completedAt: new Date(),
            },
            {
                _id: request?.id,
            }
        );
        const { txHash } = config;
        const claimantsCredentialDids =
            await credentialService.getCredentialDidsFromClaimants({
                claimants: plot.claimants,
                did,
                companyName,
                plotId: plot._id,
            });
        const _claimants = [];
        claimantsCredentialDids.plot = {
            did,
            transactionId: txHash,
        };
        if (claimantsCredentialDids.claimants) {
            const credentialChannel = await rabbitMQ.createChannel();
            const correlationId = randomUUID();
            const replyQueue = await credentialChannel.assertQueue(
                correlationId
            );
            const promises = plot.claimants?.map(async (claimant) => {
                const { verifiableCredential, credentialHash } =
                    await credentialService.createClaimantVerifiableCredential({
                        subject: {
                            claims: {
                                plot: plot?._id,
                                ...claimant,
                            },
                        },
                        issuerKey: did,
                    });
                const request = await RequestRepo.createRequest({
                    data: {
                        mintingConfig: config,
                        credential: credentialHash,
                        verifiedCredential: verifiableCredential,
                        companyName,
                    },
                    type: REQUEST_TYPE.MINTING_TYPE.createClaimantCredential,
                    status: "pending",
                });
                const requestMessage = {
                    type: REQUEST_TYPE.CARDANO_SERVICE.mintCredential,
                    data: {
                        credentials: [credentialHash],
                        type: "credential",
                        config,
                    },
                    id: request._id,
                    options: {
                        skipWait: true,
                    },
                };
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
                        credentialChannel.consume(
                            replyQueue.queue,
                            async (msg) => {
                                if (msg !== null) {
                                    const cardanoResponse = JSON.parse(
                                        msg.content
                                    );
                                    const config = cardanoResponse.data;
                                    if (
                                        cardanoResponse.id ===
                                        request._id.toString()
                                    ) {
                                        const _verifiedCredential =
                                            await RabbitRepository(
                                                accessToken
                                            ).createClaimantCredential({
                                                credentialHash,
                                                companyName,
                                                verifiedCredential:
                                                    verifiableCredential,
                                                txHash: config.txHash,
                                            });
                                        await RequestRepo.findOneAndUpdate(
                                            {
                                                response: {
                                                    config,
                                                    verifiedCredential:
                                                        _verifiedCredential,
                                                },
                                                status: "completed",
                                                completedAt: new Date(),
                                            },
                                            {
                                                _id: request?.id,
                                            }
                                        );
                                        resolve({
                                            config,
                                            did: _verifiedCredential
                                                ?.credentialSubject?.id,
                                        });
                                    }
                                    credentialChannel.ack(msg);
                                }
                                reject(
                                    new AppError(ERRORS.RABBIT_MESSAGE_ERROR)
                                );
                            }
                        );
                    }
                );
                const { config: _config, did: _did } =
                    await createClaimantCredentialHandle;
                _claimants.push({
                    userId: claimant._id,
                    did: _did,
                    transactionId: _config?.txHash,
                });
            });
            await Promise.all(promises).catch((error) => {
                console.error(error);
            });
            await credentialChannel.close();
        }
        return res.status(200).json({
            plot: {
                did,
                transactionId: txHash,
            },
            claimants: _claimants,
        });
    }),
    updatePlotCertification: asyncWrapper(async (req, res, next) => {
        const { plot } = schemaValidator(
            requestSchema.createCertificateForPlot,
            req.body
        );
        const accessToken =
            env.NODE_ENV === "test"
                ? "mock-access-token"
                : await AuthenticationService().authenticationProgress();
        const companyName = env.COMPANY_NAME;
        const { fileName } = DocumentService(
            accessToken
        ).generateFileNameForDocument(
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE,
            true
        );
        const did = generateDid(companyName, fileName);
        const { dataForm } = await DocumentService(
            accessToken
        ).createWrappedDocumentData(
            fileName,
            plot,
            WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE
        );
        schemaValidator(wrappedDocumentSchema.dataForIssueDocument, dataForm);
        const { wrappedDocument } = await DocumentService(
            accessToken
        ).issueBySignByAdmin(dataForm, companyName);
        const request = await RequestRepo.createRequest({
            data: {
                wrappedDocument,
                companyName,
                did,
                plot,
                originDid: plot.did,
            },
            type: RABBIT_REQUEST_TYPE.MINTING_TYPE.updatePlot2,
            status: "pending",
        });
        const originDocumentContent =
            await ControllerService().getDocumentContent({
                did: plot.did,
            });
        const { mintingConfig } = originDocumentContent?.data?.wrappedDoc;
        const _config = await ConsumerService().updateDocument(
            wrappedDocument?.signature?.targetHash,
            request._id,
            "document",
            request,
            mintingConfig
        );
        await RequestRepo.findOneAndUpdate(
            {
                response: _config,
                status: "completed",
                completedAt: new Date(),
            },
            {
                _id: request?.id,
            }
        );
        const { txHash } = _config;
        const claimantsCredentialDids =
            await credentialService.getCredentialDidsFromClaimants({
                claimants: plot.claimants,
                did,
                companyName,
                plotId: plot._id,
            });
        const _claimants = [];
        claimantsCredentialDids.plot = {
            did,
            transactionId: txHash,
        };
        if (claimantsCredentialDids.claimants) {
            const credentialChannel = await rabbitMQ.createChannel();
            const correlationId = randomUUID();
            const replyQueue = await credentialChannel.assertQueue(
                correlationId
            );
            const promises = plot.claimants?.map(async (claimant) => {
                const { verifiableCredential, credentialHash } =
                    await credentialService.createClaimantVerifiableCredential({
                        subject: {
                            claims: {
                                plot: plot?._id,
                                ...claimant,
                            },
                        },
                        issuerKey: did,
                    });
                const request = await RequestRepo.createRequest({
                    data: {
                        mintingConfig: _config,
                        credential: credentialHash,
                        verifiedCredential: verifiableCredential,
                        companyName,
                    },
                    type: REQUEST_TYPE.MINTING_TYPE.createClaimantCredential,
                    status: "pending",
                });
                const requestMessage = {
                    type: REQUEST_TYPE.CARDANO_SERVICE.mintCredential,
                    data: {
                        credentials: [credentialHash],
                        type: "credential",
                        config: _config,
                    },
                    id: request._id,
                    options: {
                        skipWait: true,
                    },
                };
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
                        credentialChannel.consume(
                            replyQueue.queue,
                            async (msg) => {
                                if (msg !== null) {
                                    const cardanoResponse = JSON.parse(
                                        msg.content
                                    );
                                    const config = cardanoResponse.data;
                                    if (
                                        cardanoResponse.id ===
                                        request._id.toString()
                                    ) {
                                        const _verifiedCredential =
                                            await RabbitRepository(
                                                accessToken
                                            ).createClaimantCredential({
                                                credentialHash,
                                                companyName,
                                                verifiedCredential:
                                                    verifiableCredential,
                                                txHash: config.txHash,
                                            });
                                        await RequestRepo.findOneAndUpdate(
                                            {
                                                response: {
                                                    config,
                                                    verifiedCredential:
                                                        _verifiedCredential,
                                                },
                                                status: "completed",
                                                completedAt: new Date(),
                                            },
                                            {
                                                _id: request?.id,
                                            }
                                        );
                                        resolve({
                                            config,
                                            did: _verifiedCredential
                                                ?.credentialSubject?.id,
                                        });
                                    }
                                    credentialChannel.ack(msg);
                                }
                                reject(
                                    new AppError(ERRORS.RABBIT_MESSAGE_ERROR)
                                );
                            }
                        );
                    }
                );
                const { config: __config, did: _did } =
                    await createClaimantCredentialHandle;
                _claimants.push({
                    userId: claimant._id,
                    did: _did,
                    transactionId: __config?.txHash,
                });
            });
            await Promise.all(promises).catch((error) => {
                console.error(error);
            });
            await credentialChannel.close();
        }
        return res.status(200).json({
            plot: {
                did,
                transactionId: txHash,
            },
            claimants: _claimants,
        });
    }),
    addClaimantToCertificate: asyncWrapper(async (req, res, next) => {
        const { plotDid, claimant } = schemaValidator(
            requestSchema.addClaimantToPlot,
            req.body
        );
        const plotId = plotDid.split(":")[3].split("-")[1];
        const companyName = env.COMPANY_NAME;
        const { verifiableCredential, credentialHash, did } =
            await credentialService.createClaimantVerifiableCredential({
                subject: {
                    claims: {
                        plot: plotId,
                        ...claimant,
                    },
                },
                issuerKey: plotDid,
            });
        const request = await RequestRepo.createRequest({
            data: {
                credential: credentialHash,
                verifiedCredential: verifiableCredential,
                companyName,
                originDid: plotDid,
            },
            type: REQUEST_TYPE.MINTING_TYPE.addClaimantToPlot2,
            status: "pending",
        });
        const documentContentResponse =
            await ControllerService().getDocumentContent({
                did: plotDid,
            });
        const { mintingConfig } = documentContentResponse.data?.wrappedDoc;
        const credentialChannel = await rabbitMQ.createChannel();
        const correlationId = randomUUID();
        const replyQueue = await credentialChannel.assertQueue(correlationId);
        const requestMessage = {
            type: REQUEST_TYPE.CARDANO_SERVICE.mintCredential,
            options: {
                skipWait: true,
            },
            data: {
                config: mintingConfig,
                credentials: [credentialHash],
                type: "credential",
            },
            id: request._id,
        };
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
                            const _verifiedCredential = await RabbitRepository(
                                "accessToken"
                            ).createClaimantCredential({
                                credentialHash,
                                companyName,
                                verifiedCredential: verifiableCredential,
                                txHash: config.txHash,
                            });
                            await RequestRepo.findOneAndUpdate(
                                {
                                    response: {
                                        config,
                                        verifiedCredential: _verifiedCredential,
                                    },
                                    status: "completed",
                                    completedAt: new Date(),
                                },
                                {
                                    _id: request?.id,
                                }
                            );
                            resolve({
                                config,
                                did: _verifiedCredential?.credentialSubject?.id,
                            });
                        }
                        credentialChannel.ack(msg);
                    }
                    reject(new AppError(ERRORS.RABBIT_MESSAGE_ERROR));
                });
            }
        );
        const { config: _config, did: _did } =
            await createClaimantCredentialHandle;
        return res.status(200).json({
            did: _did,
            transactionId: _config?.txHash,
        });
    }),
};
