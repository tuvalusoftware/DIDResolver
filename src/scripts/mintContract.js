import MongoHelper from "../libs/connectMongo.js";
import { setUpApp } from "../configs/setup/app.js";
import { env } from "../configs/constants.js";
import http from "http";
import RequestRepo from "../db/repos/requestRepo.js";
import CardanoService from "../services/Cardano.service.js";

MongoHelper();
const app = await setUpApp();
const server = http.createServer(app);
server.timeout = env.SERVER_TIMEOUT;
const port = 8005;
server.listen(port, () => {});

async function mintContract() {
    const request = await RequestRepo.findOne({
        _id: "655ad3bdb8f55f44deb853b9",
    });
    await CardanoService().storeToken({
        hash: request.data.wrappedDocument.signature.targetHash,
        id: request._id,
        type: "document",
    });
}

await mintContract();
