import MongoHelper from "../libs/connectMongo.js";
import connectRabbitMq from "../configs/setup/rabbitmq.js";
import RequestRepo from "../db/repos/requestRepo.js";
import CardanoService from "../services/Cardano.service.js";

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

(async () => {
    try {
        await connectRabbitMq();
        await MongoHelper();
        // await mintContract();
    } catch(error) {
        console.log("Error: ", error);
    }
})();  