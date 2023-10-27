import chai from "chai";
import chaiHttp from "chai-http";
import nock from "nock";

import { ERRORS } from "../../src/config/errors/error.constants.js";
import {
    VALID_CREATE_PLOT_CERTIFICATE_REQUEST_WITHOUT_CLAIMANTS,
    VALID_CREATE_PLOT_CERTIFICATE_REQUEST,
    CONTROLLER_RESPONSE,
    TASK_QUEUE_RESPONSE,
    CARDANO_RESPONSES,
    TASK_QUEUE_CREDENTIAL_REQUEST,
    REVOKE_DOCUMENT_REQUEST,
} from "../mockData.js";
import { SERVERS } from "../../src/config/constants.js";
import server from "../../server.js";

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

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
            .reply(200, CARDANO_RESPONSES.ERROR_RESPONSE);
        it("it should return error from cardano service", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/plot-mint")
                .send(VALID_CREATE_PLOT_CERTIFICATE_REQUEST_WITHOUT_CLAIMANTS)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).equal(
                        ERRORS.CANNOT_MINT_NFT.error_code
                    );
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/v2/doc")
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
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);

        nock(SERVERS.DID_CONTROLLER)
            .post("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(SERVERS.TASK_QUEUE_SERVICE)
            .post("/api/mint")
            .reply(200, TASK_QUEUE_RESPONSE.REQUEST_CREDENTIAL);
        it("It should return 'success response with empty claimants'", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/plot-mint")
                .send(VALID_CREATE_PLOT_CERTIFICATE_REQUEST_WITHOUT_CLAIMANTS)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("claimants");
                    res.body.should.have.property("plot");
                    res.body.claimants.should.be.a("array");
                    res.body.plot.should.be.a("string");
                    res.body.claimants.length.should.be.eql(0);
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(SERVERS.TASK_QUEUE_SERVICE)
            .post("/api/mint")
            .reply(200, TASK_QUEUE_RESPONSE.REQUEST_CREDENTIAL);
        it("It should return 'success mint plot data'", (done) => {
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

    describe("/POST create claimant credential", () => {
        it("it should return 'Missing parameters' error", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/claimant-credential")
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
            .post("/api/v2/credential-random")
            .reply(200, CARDANO_RESPONSES.ERROR_RESPONSE);
        it("it should return error from cardano service", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/claimant-credential")
                .send(TASK_QUEUE_CREDENTIAL_REQUEST.VALID)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).equal(
                        ERRORS.CANNOT_MINT_NFT.error_code
                    );
                    done();
                });
        });
        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/credential-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/v2/credential")
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'error from controller'", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/claimant-credential")
                .send(TASK_QUEUE_CREDENTIAL_REQUEST.VALID)
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
            .post("/api/v2/credential-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/v2/credential")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return 'success data'", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/claimant-credential")
                .send(TASK_QUEUE_CREDENTIAL_REQUEST.VALID)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.not.have.property("error_code");
                    res.body.should.not.have.property("error_message");
                    res.body.should.have.property("verifiedCredential");
                    res.body.should.have.property("credentialHash");
                    expect(res.body.credentialHash).equal(
                        TASK_QUEUE_CREDENTIAL_REQUEST.VALID.credentialHash
                    );
                    done();
                });
        });
    });

    describe("/POST revoke document", () => {
        it("It should return 'Missing parameters' error", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/revoke")
                .send({})
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("error_code")
                        .equal(ERRORS.MISSING_PARAMETERS.error_code);
                    res.body.should.have.property("error_message");
                    res.body.should.have.property("error_detail");
                    done();
                });
        });

        it("It should return 'Invalid did'", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/revoke")
                .send({
                    did: "invalid-did",
                    claimants: [],
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("error_code")
                        .equal(ERRORS.INVALID_DID.error_code);
                    res.body.should.have.property("error_message");
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("it should return 'Cannot get document' error", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/revoke")
                .send({
                    did: "did:example:example2:123456789abcdefghi#test",
                    claimants: [],
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR) ||
                            JSON.stringify(
                                ERRORS.CANNOT_GET_DOCUMENT_INFORMATION
                            )
                    );
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(SERVERS.CARDANO_SERVICE)
            .delete("/api/v2/hash")
            .reply(200, CARDANO_RESPONSES.ERROR_RESPONSE);
        it("It should return 'Error from Cardano service'", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/revoke")
                .send({
                    did: "did:example:example2:123456789abcdefghi#test",
                    claimants: [],
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("error_code")
                        .equal(ERRORS.REVOKE_DOCUMENT_FAILED.error_code);
                    res.body.should.have.property("error_message");
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(SERVERS.CARDANO_SERVICE)
            .delete("/api/v2/hash")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        it("It should return 'Success message", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/revoke")
                .send({
                    did: "did:example:example2:123456789abcdefghi#test",
                    claimants: [],
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(res.body).have.property("revoked").equal(true);
                    res.body.should.have.property("data").a("object");
                    expect(JSON.stringify(res.body.data)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.SUCCESS.wrappedDoc)
                    );
                    done();
                });
        });
    });

    describe("/UPDATE update plot document", () => {
        it('it should return "Missing parameters" error', (done) => {
            chai.request(server)
                .put("/resolver/task-queue/plot-mint")
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
            .put("/api/v2/hash/")
            .reply(200, CARDANO_RESPONSES.ERROR_RESPONSE);
        it("It should return 'Error from Cardano server'", (done) => {
            chai.request(server)
                .put("/resolver/task-queue/plot-mint")
                .send({
                    wrappedDocument: {},
                    plot: {},
                    did: "",
                    companyName: "",
                    mintingConfig: {},
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(ERRORS.CANNOT_MINT_NFT)
                    );
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .put("/api/v2/hash/")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller server' when request store document", (done) => {
            chai.request(server)
                .put("/resolver/task-queue/plot-mint")
                .send({
                    wrappedDocument: {},
                    plot: {
                        claimants: [],
                    },
                    did: "",
                    companyName: "",
                    mintingConfig: {},
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .put("/api/v2/hash/")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return 'Success message with empty claimants response' due to given claimant is empty", (done) => {
            chai.request(server)
                .put("/resolver/task-queue/plot-mint")
                .send({
                    wrappedDocument: {},
                    plot: {
                        claimants: [],
                    },
                    did: "",
                    companyName: "",
                    mintingConfig: {},
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.not.have.property("error_code");
                    res.body.should.not.have.property("error_message");
                    res.body.should.have.property("claimants");
                    expect(JSON.stringify(res.body.claimants)).equal(
                        JSON.stringify([])
                    );
                    res.body.should.have.property("plot");
                    done();
                });
        });
    });
});
