import MongoHelper from "../libs/connectMongo.js";
import { setUpApp } from "../configs/setup/app.js";
import http from "http";
import RequestRepo from "../db/repos/requestRepo.js";
import CardanoService from "../services/Cardano.service.js";

MongoHelper();
const app = await setUpApp();
const server = http.createServer(app);
const port = 8005;
server.listen(port, () => {});

async function mintContract() {
    const request = await RequestRepo.findOne({
        _id: "6570414082e83d79a69f42ef",
    });
    await CardanoService().storeCredentialsWithPolicyId({
        credentials: [request.data.credential],
        mintingConfig: request.data.mintingConfig,
        id: request?._id,
    });
}

await mintContract();
