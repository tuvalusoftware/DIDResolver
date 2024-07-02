import chai from "chai";
import { documentService } from "../../src/services/Document.service.js";

export const DocumentServiceMock = () => {
    chai.spy.on(documentService, "issueBySignByAdmin", () => {
        return {
            wrappedDocument: {
                mintingConfig: {
                    txHash: "txHash"
                },
                signature: {
                    targetHash: "targetHash"
                }
            }
        };
    });
}