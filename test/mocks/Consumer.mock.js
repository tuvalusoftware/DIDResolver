import chai from "chai";
import consumerService from "../../src/services/Consumer.service.js";

export const ConsumerServiceMock = () => {
    chai.spy.on(consumerService, "createDocument", () => {
        return {
            txHash: "this is sample txHash",
            assetName: "this is sample assetName",
        };
    });
};
