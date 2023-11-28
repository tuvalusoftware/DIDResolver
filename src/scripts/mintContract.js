import { Logger } from "tslog";
import MongoHelper from "../libs/connectMongo.js";
import { setUpApp } from "../configs/setup/app.js";
import { env } from "../configs/constants.js";
import http from "http";
import RequestRepo from "../db/repos/requestRepo.js";
import CardanoService from "../services/Cardano.service.js";

const logger = new Logger();
MongoHelper();
const app = await setUpApp();
const server = http.createServer(app);
server.timeout = env.SERVER_TIMEOUT;
const port = 8005;
server.listen(port, () => {
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`Server is live: http://localhost:${port}`);
});

async function mintContract() {
    const request = await RequestRepo.findOne({
        _id: "655ad3bdb8f55f44deb853b9",
    });
    await CardanoService('accessToken').storeToken({
        hash: request.data.wrappedDocument.signature.targetHash,
        id: request._id,
        type: "document",
    });
}

async function createClaimantCredential() {
    const request = await RequestRepo.findOne({
        _id: "656449d91458fe9c04c4b4c5",
    });
    await CardanoService(
        'accessToken'
    ).storeCredentialsWithPolicyId({
        credentials: [request.data.credential],
        mintingConfig: request.data.mintingConfig,
        id: request?._id,
    });
}

// await mintContract();
await createClaimantCredential();
