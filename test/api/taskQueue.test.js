import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
import nock from "nock";
import sinon from "sinon";

import { ERRORS } from "../../src/config/errors/error.constants.js";
import { SERVERS } from "../../src/config/constants.js";
import server from "../../server.js";

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

const VALID_CREATE_PLOT_CERTIFICATE_REQUEST_WITHOUT_CLAIMANTS = {
    wrappedDocument: {
        data: {
            profileImage:
                "3d44bd43-9b4b-45a6-b4dc-25cdd738ff1a:string:sampleProfileImage",
            fileName: "Sample-Plot-Certificate-64db86559e77a4ffc2395ada_810_1",
            name: "328ecc0a-7a53-4a14-ab9b-c81fd9b25e21:string:Land Certificate",
            title: "2e9569eb-966b-4354-96e1-72ff516a126a:string:Land-Certificate-VNZ-739",
            No: "f910f941-e772-4a06-80a2-ebea28e1065c:string:ea2c033",
            dateIssue:
                "fc2523b9-dc48-4e70-995d-5761c3f70410:string:2023-10-08 04:29:46",
            plotInformation: ["Object"],
            certificateByCommonlands: ["Object"],
            certificateByCEO: ["Object"],
            companyName:
                "9a683014-fdc1-41a7-b645-d4f56755d9fd:string:COMMONLANDS_2",
            intention: "ffbc0ce2-e6f5-4bc4-8101-5a9b848bc516:string:trade",
            did: "e41d1aca-0f14-4799-9ecd-373798736b35:string:did:fuixlabs:COMMONLANDS_2:PlotCertification-64db86559e77a4ffc2395ada_810_1",
            issuers: [
                {
                    address: "0x1234567890abcdef",
                },
            ],
        },
        signature: {
            type: "SHA3MerkleProof",
            targetHash:
                "5561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
            proof: ["Array"],
            merkleRoot:
                "5561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
        },
        mintingConfig: {
            type: "document",
            policy: ["Object"],
            asset: "96f9eba3d9424b6c788166adfd93f36baa2f97ef282913ff40e871e25561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
            txHash: "b1d653de765f0c069683f71b15f1b622743cb8d10359998aeeabc5deec03512b",
            walletId: 2,
        },
    },
    plot: {
        plotId: "0x1234567890abcdef",
        plotSize: 1000,
        plotCoordinates: {
            latitude: 1.123456789,
            longitude: 2.123456789,
        },
        plotAddress: "0x1234567890abcdef",
        plotImage: "https://example.com/plot-image",
    },
    did: "did:cardano:1234567890abcdef",
    companyName: "Example Company",
};

const VALID_CREATE_PLOT_CERTIFICATE_REQUEST = {
    wrappedDocument: {
        data: {
            profileImage:
                "3d44bd43-9b4b-45a6-b4dc-25cdd738ff1a:string:sampleProfileImage",
            fileName: "Sample-Plot-Certificate-64db86559e77a4ffc2395ada_810_1",
            name: "328ecc0a-7a53-4a14-ab9b-c81fd9b25e21:string:Land Certificate",
            title: "2e9569eb-966b-4354-96e1-72ff516a126a:string:Land-Certificate-VNZ-739",
            No: "f910f941-e772-4a06-80a2-ebea28e1065c:string:ea2c033",
            dateIssue:
                "fc2523b9-dc48-4e70-995d-5761c3f70410:string:2023-10-08 04:29:46",
            plotInformation: ["Object"],
            certificateByCommonlands: ["Object"],
            certificateByCEO: ["Object"],
            companyName:
                "9a683014-fdc1-41a7-b645-d4f56755d9fd:string:COMMONLANDS_2",
            intention: "ffbc0ce2-e6f5-4bc4-8101-5a9b848bc516:string:trade",
            did: "e41d1aca-0f14-4799-9ecd-373798736b35:string:did:fuixlabs:COMMONLANDS_2:PlotCertification-64db86559e77a4ffc2395ada_810_1",
            issuers: [
                {
                    address: "0x1234567890abcdef",
                },
            ],
        },
        signature: {
            type: "SHA3MerkleProof",
            targetHash:
                "5561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
            proof: ["Array"],
            merkleRoot:
                "5561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
        },
        mintingConfig: {
            type: "document",
            policy: ["Object"],
            asset: "96f9eba3d9424b6c788166adfd93f36baa2f97ef282913ff40e871e25561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
            txHash: "b1d653de765f0c069683f71b15f1b622743cb8d10359998aeeabc5deec03512b",
            walletId: 2,
        },
    },
    plot: {
        plotId: "0x1234567890abcdef",
        plotSize: 1000,
        plotCoordinates: {
            latitude: 1.123456789,
            longitude: 2.123456789,
        },
        plotAddress: "0x1234567890abcdef",
        plotImage: "https://example.com/plot-image",
        claimants: [
            {
                id: "did:fuixlabs:commonlands:12345678901",
                plot: "65191bba01a8fd1c431262a1",
                user: "65191bba01a8fd1c431262a2",
                type: "owner",
                plotCertificate: "did:fuixlabs:commonlands:09876",
            },
        ],
    },
    did: "did:cardano:1234567890abcdef",
    companyName: "Example Company",
};

const CARDANO_ERROR_RESPONSE = {
    data: {
        code: 1,
        error_message: "Error from cardano service",
    },
};

const CARDANO_CONFIG_RESPONSE = {
    code: 0,
    data: {
        policy: "1234567890abcdef",
        network: "testnet",
        protocol: "https",
        host: "cardano.example.com",
        port: 443,
    },
};

const CONTROLLER_RESPONSE = {
    ERROR: {
        error_code: 1,
        error_message: "Error from controller",
    },
    SUCCESS: {
        success: true,
        data: {},
    },
};

const TASK_QUEUE_RESPONSE = {
    INVALID_INPUT: {
        error_code: 4002,
        error_message: "Bad request. Invalid input syntax.",
    },
    REQUEST_CREDENTIAL: {
        data: {
            did: "did:cardano:1234567890abcdef",
        },
    },
};

describe("TASK QUEUE", function () {
    this.timeout(0);

    describe("/POST create plot certificate", () => {
        it('it should return "Missing parameters" error', (done) => {
            chai.request(server)
                .post("/resolver/task-queue/plot-mint")
                .send({})
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).equal(
                        ERRORS.MISSING_PARAMETERS.error_code
                    );
                    done();
                });
        });
        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_ERROR_RESPONSE);
        it("it should return error from cardano service", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/plot-mint")
                .send(VALID_CREATE_PLOT_CERTIFICATE_REQUEST_WITHOUT_CLAIMANTS)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    res.body.should.have.property("error_detail");
                    expect(res.body.error_code).equal(
                        ERRORS.CANNOT_MINT_NFT.error_code
                    );
                    expect(JSON.stringify(res.body.error_detail)).equal(
                        JSON.stringify(CARDANO_ERROR_RESPONSE)
                    );
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/doc")
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Cannot store certificate' error", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/plot-mint")
                .send(VALID_CREATE_PLOT_CERTIFICATE_REQUEST_WITHOUT_CLAIMANTS)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR) ||
                            JSON.stringify(ERRORS.CANNOT_STORE_DOCUMENT)
                    );
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return 'Error while creating credential for claimant'", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/plot-mint")
                .send(VALID_CREATE_PLOT_CERTIFICATE_REQUEST_WITHOUT_CLAIMANTS)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).equal(
                        ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT.error_code
                    );
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_CONFIG_RESPONSE);

        nock(SERVERS.DID_CONTROLLER)
            .post("/api/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(SERVERS.TASK_QUEUE_SERVICE)
            .post("/api/mint")
            .reply(200, TASK_QUEUE_RESPONSE.INVALID_INPUT);
        it("It should return 'Invalid input syntax.'", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/plot-mint")
                .send(VALID_CREATE_PLOT_CERTIFICATE_REQUEST)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).equal(
                        ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT.error_code
                    );
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_CONFIG_RESPONSE);

        nock(SERVERS.DID_CONTROLLER)
            .post("/api/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(SERVERS.TASK_QUEUE_SERVICE)
            .post("/api/mint")
            .reply(200, TASK_QUEUE_RESPONSE.REQUEST_CREDENTIAL);
        it("It should return ''", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/plot-mint")
                .send(VALID_CREATE_PLOT_CERTIFICATE_REQUEST)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("claimants");
                    res.body.should.have.property("plot");
                    res.body.claimants.should.be.a("array");
                    res.body.plot.should.be.a("string");
                    done();
                });
        });
    });
});
