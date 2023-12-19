import MongoHelper from "../libs/connectMongo.js";
import connectRabbitMq from "../configs/setup/rabbitmq.js";
import RequestRepo from "../db/repos/requestRepo.js";
import { RequestModel } from "../db/models/requestModel.js";
import ConsumerService from "../services/Consumer.service.js";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
import credentialService from "../services/VerifiableCredential.service.js";
import { REQUEST_TYPE } from "../rabbit/config.js";
import ControllerService from "../services/Controller.service.js";

async function reMintSpecificPlot() {
    const request = await RequestRepo.findOne({
        _id: "657fec275ad19c0a9332875f",
    });
    const wrappedDocument = deepUnsalt(request.data.wrappedDocument);
    const plot = wrappedDocument.data.plot;
    const { companyName, fileName, did } = wrappedDocument.data;
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
    console.log(`Re-minted plot ${plot._id}!`);
    const { txHash, assetName } = config;
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
            const request_ = await RequestRepo.createRequest({
                data: {
                    mintingConfig: config,
                    credential: credentialHash,
                    verifiedCredential: verifiableCredential,
                    companyName,
                },
                type: REQUEST_TYPE.MINTING_TYPE.createClaimantCredential,
                status: "pending",
            });
        });
    }
    console.log(
        `Re-minted all credentials for plot ${plot._id}! ${_claimants.length} credentials minted!`
    );
}

async function changePlotStatusToDuplicate() {
    const request = await RequestRepo.findOneAndUpdate(
        {
            status: "duplicate",
        },
        {
            _id: "657fcfd7420672a91f37bc75",
        }
    );
    console.log(`Changed plot status to duplicate!`);
}

async function reMintUpdatePlots() {
    console.log("Re-minting update plots...");
    const requests = await RequestModel.find({
        type: REQUEST_TYPE.MINTING_TYPE.updatePlot2,
        status: "pending",
    });
    console.log(`Found ${requests.length} update plot requests!`);
    if (requests.length > 0) {
        const promises = requests.map(async (request) => {
            const originDid = request.data.originDid;
            const wrappedDocument = deepUnsalt(request.data.wrappedDocument);
            const did = wrappedDocument.data.did;
            const plot = wrappedDocument.data.plot; 
            const companyName = wrappedDocument.data.companyName;
            const originDocumentContent =
                await ControllerService().getDocumentContent({
                    did: originDid,
                });
            const { mintingConfig } = originDocumentContent.data.wrappedDoc;
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
            const { txHash, assetName } = _config;
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
            console.log(`Re-minted plot ${plot._id}`);
            if (claimantsCredentialDids.claimants) {
                const promises = plot.claimants?.map(async (claimant) => {
                    const { verifiableCredential, credentialHash } =
                        await credentialService.createClaimantVerifiableCredential(
                            {
                                subject: {
                                    claims: {
                                        plot: plot?._id,
                                        ...claimant,
                                    },
                                },
                                issuerKey: did,
                            }
                        );
                    await RequestRepo.createRequest({
                        data: {
                            mintingConfig: _config,
                            credential: credentialHash,
                            verifiedCredential: verifiableCredential,
                            companyName,
                        },
                        type: REQUEST_TYPE.MINTING_TYPE
                            .createClaimantCredential,
                        status: "pending",
                    });
                });
                await Promise.all(promises).catch((error) => {
                    console.error(error);
                });
                await credentialChannel.close();
            }
        });
        await Promise.all(promises).catch((error) => {
            console.error(error);
        });
    }
    console.log("Re-minted all update plots!");
}

(async () => {
    try {
        await connectRabbitMq();
        await MongoHelper();
        await reMintUpdatePlots();
        // await reMintSpecificPlot();
        // await reMintPlots();
        // await changePlotStatusToDuplicate();
    } catch (error) {
        console.log("Error: ", error);
    }
})();
