import MongoHelper from "../libs/connectMongo.js";
import connectRabbitMq from "../configs/setup/rabbitmq.js";
import RequestRepo from "../db/repos/requestRepo.js";
import ConsumerService from "../services/Consumer.service.js";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
import credentialService from "../services/VerifiableCredential.service.js";

async function reMintSpecificPlot() {
    const request = await RequestRepo.findOne({
        _id: "657920237d4df5ffdf362b16",
    });
    const wrappedDocument = deepUnsalt(request.data.wrappedDocument);
    const plot = wrappedDocument.data.plot;
    const {companyName, fileName, did} = wrappedDocument.data;
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
    console.log(`Re-minted plot ${plot._id}!`)
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
    if(claimantsCredentialDids.claimants) {
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
        })
    }
    console.log(`Re-minted all credentials for plot ${plot._id}! ${_claimants.length} credentials minted!`);
}

async function changePlotStatusToDuplicate() {
    const request = await RequestRepo.findOneAndUpdate({
        status: "duplicate",
    }, {
        _id: "657972533262e379b24b8428",
    });
    console.log(`Changed plot status to duplicate!`);
}

async function reMintPlots() {

}

(async () => {
    try {
        await connectRabbitMq();
        await MongoHelper();
        // await reMintSpecificPlot();
        // await reMintPlots();
        await changePlotStatusToDuplicate();
    } catch(error) {
        console.log("Error: ", error);
    }
})();