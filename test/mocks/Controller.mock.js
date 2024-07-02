import chai from "chai";
import ControllerService from "../../src/services/Controller.service.js";

export const ControllerServiceMock = () => {
    chai.spy.on(ControllerService, "isExisted", () => {
        return {
            isExists: false,
        }
    });

    chai.spy.on(ControllerService, "storeDocument", () => {
        return {
            data: {
                data: true
            },
        }
    }); 

    chai.spy.on(ControllerService, "getDocumentContent", () => {
        return {
            data: {
                wrappedDocument: {
                    mintingConfig: {
                        txHash: "txHash",
                    },
                    signature: {
                        targetHash: "targetHash",
                    },
                },
            },
        };
    });
}