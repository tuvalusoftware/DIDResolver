import MongoHelper from "../libs/connectMongo.js";
import connectRabbitMq from "../configs/setup/rabbitmq.js";
import RequestRepo from "../db/repos/requestRepo.js";
import { RequestModel } from "../db/models/requestModel.js";
import CardanoService from "../services/Cardano.service.js";
import credentialService from "../services/VerifiableCredential.service.js";
import { deepUnsalt } from "../fuixlabs-documentor/utils/data.js";
import { REQUEST_TYPE } from "../rabbit/config.js";
import ControllerService from "../services/Controller.service.js";

// // Re-mint specific credential with given request id
async function reMintSpecificCredential() {
    // const request = await RequestRepo.findOne({
    //     _id: "65963013201db7b07eb042ca",
    // });
    const _t = {
        verifiableCredential: {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "http://175.41.177.26:59002/config/dominium-credential.json",
                "https://w3id.org/security/suites/ed25519-2020/v1",
            ],
            id: "did:fuixlabs:commonlands:nlxisyzm",
            type: ["VerifiableCredential", "ClaimantCredential"],
            issuer: "did:fuixlabs:commonlands:PlotCertification_65962f3576fea2bfd134f2be",
            credentialSubject: {
                id: "did:fuixlabs:commonlands:10d1ace6ebc4ab82d6b1b58136af97577d1b338adb6ddb94823a84f9b1caeafd",
                type: ["ClaimSubject"],
                claims: {
                    type: ["Claims"],
                    plot: "65962f3576fea2bfd134f2be",
                    user: "did:fuixlabs:commonlands:addr_test1qr5ekmsrvpmfm4enpqvcscyncgzlsmul2zlj5wqsfnv3zdfdvs03kgjeymcmq0rr4rgrzswfy8k4c263l6h0v4qfcuus08gfu0",
                    role: "rightOfUse",
                    plotCertificate:
                        "did:fuixlabs:commonlands:PlotCertification_65962f3576fea2bfd134f2be",
                },
            },
            proof: {
                type: "Ed25519Signature2020",
                created: "2024-01-04T09:55:58.818Z",
                verificationMethod:
                    "did:key:2j7K2vSq5Z1eMW1X3BC3Fn6S6qwzBkezYfYbs94shXyY#2j7K2vSq5Z1eMW1X3BC3Fn6S6qwzBkezYfYbs94shXyY",
                proofPurpose: "assertionMethod",
                proofValue:
                    "z2hWagLshJuAFvDuyaFFKg1KHdad8SHMsvTvQSD8TAPSxC1uJoAhpR8ZTPFhUa6b6M1HETi7h3tViEoxG7WAXuiFx",
            },
        },
        credentialHash:
            "10d1ace6ebc4ab82d6b1b58136af97577d1b338adb6ddb94823a84f9b1caeafd",
        did: "did:fuixlabs:commonlands:10d1ace6ebc4ab82d6b1b58136af97577d1b338adb6ddb94823a84f9b1caeafd",
    };
    await CardanoService().storeCredentialsWithPolicyId({
        credentials: [_t.credentialHash],
        mintingConfig: {
            "unit": "9f91600a059e2379a9a00a9fde8aa318b29b337767d62e3904595c5a15b3840165e4802aa454cc1c903ecf9b966beb07610299fed60553ab35c91d21",
            "forgingScript": "82018282051b00000001d19d0e938200581cc1a233eea8e040c9c209de99ecb78be50c76951aadd89a90d77a0ae3",
            "policyId": "9f91600a059e2379a9a00a9fde8aa318b29b337767d62e3904595c5a",
            "assetName": "15b3840165e4802aa454cc1c903ecf9b966beb07610299fed60553ab35c91d21",
            "txHash": "62eff1d9742fd0d86131cd3360209f52683ed33052e9a98ed0afb51ea809a199"
        },
        id: '65967a3e3d8724dd90c2f7e6',
    });
}

// Re-mint all credentials with status pending
async function reMintCredential() {
    const requests = await RequestModel.find({
        status: "pending",
        type: "create-claimant-credential",
    });
    for (const request of requests) {
        await CardanoService().storeCredentialsWithPolicyId({
            credentials: [request.data.credential],
            mintingConfig: request.data.mintingConfig,
            id: request?._id,
        });
    }
    console.log("Re-minted all credentials!");
    return;
}

async function reMintCredentialOfPlot() {
    const request = await RequestRepo.findOne({
        _id: "6597a01d139ab4ae479b3776",
    });
    const claimants = request.data.plot.claimants;
    const plot = request.data.plot;
    const config = request.response;
    const wrappedDocument = deepUnsalt(request.data.wrappedDocument);
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

async function reSignAllPendingContractRequests() {
    const requests = await RequestModel.find({
        type: "sign-contract",
        status: "pending",
    });
    console.log(`Found ${requests.length} requests`);
    await Promise.all(requests.map(async (request) => {
        const { originDid, credential } = request.data;
        const documentContentResponse =
            await ControllerService().getDocumentContent({
                did: originDid,
            });
        if (
            !documentContentResponse.data?.wrappedDoc?.mintingConfig
        ) {
            console.log(
                `There are no mintingConfig in request ${request._id}`
            );
            throw new AppError(ERRORS.INVALID_INPUT);
        }
        const { mintingConfig } =
            documentContentResponse.data.wrappedDoc;
        await CardanoService().storeCredentialsWithPolicyId(
            {
                credentials: [credential],
                mintingConfig,
                id: request._id,
            }
        );
        console.log(
            `Cron sign contract ${request._id} finished`
        );
    }))
}

(async () => {
    try {
        await connectRabbitMq();
        await MongoHelper();
        // await reMintCredentialOfPlot();
        // await reMintSpecificCredential();
        // await reMintCredential();
        await reSignAllPendingContractRequests();
        // await lmeo();
    } catch (error) {
        console.log("Error: ", error);
    }
})();
