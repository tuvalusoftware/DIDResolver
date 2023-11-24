import { Logger } from "tslog";
import MongoHelper from "../libs/connectMongo.js";
import { setUpApp } from "../configs/setup/app.js";
import { env } from "../configs/constants.js";
import http from "http";
import RequestRepo from "../db/repos/requestRepo.js";
import CardanoService from "../services/Cardano.service.js";
import AuthenticationService from "../services/Authentication.service.js";

const logger = new Logger();
await MongoHelper().connect();
const app = await setUpApp();
const server = http.createServer(app);
server.timeout = env.SERVER_TIMEOUT;
const port = env.NODE_ENV !== "test" ? env.SERVER_PORT : 8001;
server.listen(port, () => {
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`Server is live: http://localhost:${port}`);
});

async function mintContract() {
    const request = await RequestRepo.findOne({
        _id: "65547bbd7dbef1f198c125b0",
    });
    const accessToken =
        env.NODE_ENV === "test"
            ? "mock-access-token"
            : await AuthenticationService().authenticationProgress();
    await CardanoService(accessToken).storeToken({
        hash: request.data.wrappedDocument.signature.targetHash,
        id: request._id,
        type: "document",
    });
}

await mintContract();
