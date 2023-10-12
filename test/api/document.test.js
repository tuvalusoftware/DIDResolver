import chai from "chai";
import chaiHttp from "chai-http";
import nock from "nock";

import server from "../../server.js";
import { ERRORS } from "../../src/config/errors/error.constants.js";
import { SERVERS } from "../../src/config/constants.js";
import {
    CONTROLLER_RESPONSE,
    WRAPPED_DOCUMENT_REQUEST,
    TASK_QUEUE_RESPONSE,
} from "../mockData.js";

chai.use(chaiHttp);
let should = chai.should();
let expect = chai.expect;

describe("DOCUMENT", function () {
    this.timeout(0);

    describe("GET /resolver/commonlands/document", () => {
        it("It should return 'Invalid did syntax'", (done) => {
            chai.request(server)
                .get("/resolver/commonlands/document/123")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).to.equal(
                        ERRORS.INVALID_DID.error_code
                    );
                    done();
                });
        });
    });

    describe("POST /resolver/commonlands/document/hash", () => {
        it('It should return "Invalid did syntax"', (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/hash")
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).to.equal(
                        ERRORS.MISSING_PARAMETERS.error_code
                    );
                    done();
                });
        });

        it("It should return 'Missing field error'", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/hash")
                .send(WRAPPED_DOCUMENT_REQUEST.INVALID_DOCUMENT)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify({
                            error_code: 400,
                            error_message:
                                "claimant is required! Please check your input again!",
                        })
                    );
                    done();
                });
        });

        it("It should return 'Success data'", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/hash")
                .send(WRAPPED_DOCUMENT_REQUEST.VALID_DOCUMENT)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("targetHash");
                    done();
                });
        });
    });

    describe("/POST /resolver/commonlands/document/latest-version", () => {
        it("It should return 'Missing parameters error'", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/lastest-version")
                .send({})
                .end((err, res) => {
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

        it("It should return 'Invalid did'", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/lastest-version")
                .send({ did: "123", hash: "123" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).equal(
                        ERRORS.INVALID_DID.error_code
                    );
                    done();
                });
        });
    });

    describe("/POST /resolver/commonlands/document/certificate/add-claimant", () => {
        it("It should return 'Missing parameters error'", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/certificate/add-claimant")
                .send({})
                .end((err, res) => {
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

        it("It should return 'Invalid did'", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/certificate/add-claimant")
                .send({ plotDid: "123", claimant: {} })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).equal(
                        ERRORS.INVALID_DID.error_code
                    );
                    done();
                });
        });

        it("It should return 'Missing parameters of credential subject'", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/certificate/add-claimant")
                .send({ plotDid: "did:example:ethr:0x123", claimant: {} })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    res.body.should.have.property("error_detail");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify({
                            ...ERRORS.MISSING_PARAMETERS,
                            error_detail: "Invalid credential subject",
                        })
                    );
                    done();
                });
        });

        nock(SERVERS.TASK_QUEUE_SERVICE)
            .get("/api/db/isExists")
            // .query((queryObj) => queryObj.did)
            .query({ did: "did:example:ethr:0x123" })
            .reply(200, TASK_QUEUE_RESPONSE.ADD_CLAIMANT_DATA_IS_EXISTED);
        it("It should return 'exists data from task queue'", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/certificate/add-claimant")
                .send({
                    plotDid: "did:example:ethr:0x123",
                    claimant: {
                        plot: "example",
                        did: "example",
                        role: "example",
                    },
                })
                .end((err, res) => {
                    done();
                });
        });

        // nock(SERVERS.TASK_QUEUE_SERVICE)
        //     .post("/api/mint")
        //     .reply(200, TASK_QUEUE_RESPONSE.BAD_REQUEST);
        // it("It should return 'error object from task queue server'", (done) => {
        //     chai.request(server)
        //         .post("/resolver/commonlands/document/certificate/add-claimant")
        //         .send({
        //             plotDid: "did:example:ethr:0x123",
        //             claimant: {
        //                 plot: "example",
        //                 did: "example",
        //                 role: "example",
        //             },
        //         })
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             res.body.should.be.a("object");
        //             res.body.should.have.property("error_code");
        //             res.body.should.have.property("error_message");
        //             expect(res.body.error_code).equal(
        //                 TASK_QUEUE_RESPONSE.BAD_REQUEST.error_code ||
        //                     ERRORS.PUSH_TO_TASK_QUEUE_FAILED
        //             );
        //             done();
        //         });
        // });

        // nock(SERVERS.TASK_QUEUE_SERVICE)
        //     .post("/api/mint")
        //     .reply(200, TASK_QUEUE_RESPONSE.REQUEST_CREDENTIAL);
        // it("It should return 'success response from task queue'", (done) => {
        //     chai.request(server)
        //         .post("/resolver/commonlands/document/certificate/add-claimant")
        //         .send({
        //             plotDid: "did:example:ethr:0x123",
        //             claimant: {
        //                 plot: "example",
        //                 did: "example",
        //                 role: "example",
        //             },
        //         })
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             res.body.should.be.a("object");
        //             res.body.should.not.have.property("error_code");
        //             res.body.should.not.have.property("error_message");
        //             res.body.should.not.have.property("error_detail");
        //             expect(JSON.stringify(res.body)).to.equal(
        //                 JSON.stringify(
        //                     TASK_QUEUE_RESPONSE.REQUEST_CREDENTIAL.data
        //                 )
        //             );
        //             done();
        //         });
        // });
    });

    describe("/POST create plot certificate", () => {
        it("It should return 'Missing parameters error'", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/certificate")
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    res.body.should.have.property("error_detail");
                    expect(res.body.error_code).equal(
                        ERRORS.MISSING_PARAMETERS.error_code
                    );
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc/exists")
            .query((queryObj) => queryObj.companyName && queryObj.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_EXISTED);
        it("It should return ''", (done) => {
            chai.request(server)
                .post("/resolver/commonlands/document/certificate")
                .send(WRAPPED_DOCUMENT_REQUEST.VALID_DOCUMENT)
                .end((err, res) => {
                    done();
                });
        });
    });

    describe("/PUT update plot certificate", () => {
        it("It should return 'Missing parameters error'", (done) => {
            chai.request(server)
                .put("/resolver/commonlands/document/certificate")
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    res.body.should.have.property("error_detail");
                    expect(res.body.error_code).equal(
                        ERRORS.MISSING_PARAMETERS.error_code
                    );
                    done();
                });
        });

        it("It should return 'Invalid input'", (done) => {
            chai.request(server)
                .put("/resolver/commonlands/document/certificate")
                .send(WRAPPED_DOCUMENT_REQUEST.INVALID_DOCUMENT)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).equal(
                        ERRORS.INVALID_INPUT.error_code
                    );
                    done();
                });
        });
    });
});
