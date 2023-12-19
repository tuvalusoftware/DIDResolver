import MongoHelper from "../libs/connectMongo.js";
import connectRabbitMq from "../configs/setup/rabbitmq.js";
import RequestRepo from "../db/repos/requestRepo.js";
import { RequestModel } from "../db/models/requestModel.js";
import CardanoService from "../services/Cardano.service.js";
import credentialService from "../services/VerifiableCredential.service.js";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
import { REQUEST_TYPE } from "../rabbit/config.js";

// // Re-mint specific credential with given request id
async function reMintSpecificCredential() {
    const request = await RequestRepo.findOne({
        _id: "657969313262e379b24b8251",
    });
    await CardanoService().storeCredentialsWithPolicyId({
        credentials: [request.data.credential],
        mintingConfig: request.data.mintingConfig,
        id: request?._id,
    });
    
}

// Re-mint all credentials with status pending
async function reMintCredential() {
    const requests = await RequestModel.find({
        status: "pending",
        type: "create-claimant-credential",
    });
    console.log(requests.length);
    for (const request of requests) {
        await CardanoService().storeCredentialsWithPolicyId({
            credentials: [request.data.credential],
            mintingConfig: request.data.mintingConfig,
            id: request?._id,
        });
    }
    console.log('Re-minted all credentials!');
    return;
}

async function reMintCredentialOfPlot() {
    const request = await RequestRepo.findOne({
        _id: "657fec275ad19c0a9332875f",
    });
    const claimants = request.data.plot.claimants;
    const plot = request.data.plot;
    const config = request.response;
    const wrappedDocument = deepUnsalt(request.data.wrappedDocument)
    const did = wrappedDocument.data.did;
    const companyName = wrappedDocument.data.companyName;
    const claimantsCredentialDids =
        await credentialService.getCredentialDidsFromClaimants({
            claimants: plot.claimants,
            did,
            companyName,
            plotId: plot._id,
        });
    const promises = plot.claimants.map(async (claimant) => {
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
        await CardanoService().storeCredentialsWithPolicyId({
            credentials: [credentialHash],
            mintingConfig: config,
            id: request_?._id,
        });
    });
    await Promise.all(promises).catch((error) => {
        console.error(error);
    });
    console.log("Done!");
}

(async () => {
    try {
        await connectRabbitMq();
        await MongoHelper();
        await reMintCredentialOfPlot();
        // await reMintSpecificCredential();
        // await reMintCredential();
    } catch(error) {
        console.log("Error: ", error);
    }
})();

