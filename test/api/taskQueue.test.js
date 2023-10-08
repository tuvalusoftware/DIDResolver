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
                    res.body.should.have.property("error_detail");
                    expect(res.body.error_code).equal(
                        ERRORS.CANNOT_MINT_NFT.error_code
                    );
                    expect(JSON.stringify(res.body.error_detail)).equal(
                        JSON.stringify(CARDANO_RESPONSES.ERROR_RESPONSE)
                    );
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
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
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);

        nock(SERVERS.DID_CONTROLLER)
            .post("/api/doc")
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
            .post("/api/doc")
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
                    res.body.should.have.property("error_detail");
                    expect(res.body.error_code).equal(
                        ERRORS.CREDENTIAL_FAILED.error_code
                    );
                    expect(JSON.stringify(res.body.error_detail)).equal(
                        JSON.stringify(CARDANO_RESPONSES.ERROR_RESPONSE)
                    );
                    done();
                });
        });
        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/credential-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/credential")
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
            .post("/api/credential")
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
        it('it should return "Missing parameters" error', (done) => {
            chai.request(server)
                .post("/resolver/task-queue/revoke")
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
            .delete("/api/v2/hash")
            .reply(200, CARDANO_RESPONSES.ERROR_RESPONSE);
        it("it should return 'error from cardano service'", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/revoke")
                .send(REVOKE_DOCUMENT_REQUEST)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    res.body.should.have.property("error_detail");
                    expect(res.body.error_code).equal(
                        ERRORS.REVOKE_DOCUMENT_FAILED.error_code
                    );
                    expect(JSON.stringify(res.body.error_detail)).equal(
                        JSON.stringify(CARDANO_RESPONSES.ERROR_RESPONSE)
                    );
                    done();
                });
        });

        nock(SERVERS.CARDANO_SERVICE)
            .delete("/api/v2/hash")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        it("it should return 'revoke successfully response'", (done) => {
            chai.request(server)
                .post("/resolver/task-queue/revoke")
                .send(REVOKE_DOCUMENT_REQUEST)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.not.have.property("error_code");
                    res.body.should.not.have.property("error_message");
                    res.body.should.have.property("revoked");
                    expect(res.body.revoked).equal(true);
                    done();
                });
        });
    });
});
