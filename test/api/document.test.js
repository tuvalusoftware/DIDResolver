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

    describe("/GET Get document by given did", () => {
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

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller' when server request to get did of document", (done) => {
            chai.request(server)
                .get("/resolver/commonlands/document/did:example:ethr:0x123")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
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
        it("It should return 'Object include hash and did of request document's did'", (done) => {
            chai.request(server)
                .get("/resolver/commonlands/document/did:example:ethr:0x123")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.not.have.property("error_code");
                    res.body.should.not.have.property("error_message");
                    res.body.should.not.have.property("error_detail");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify({
                            hash: CONTROLLER_RESPONSE.SUCCESS.wrappedDoc
                                .signature.targetHash,
                            did: "did:example:ethr:0x123",
                        })
                    );
                    done();
                });
        });
    });

    describe("/POST Return hash of given document content", () => {
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

    describe("/POST Check dose the given document'did is the last version of its endorsement chain", () => {
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

    describe("/POST Add claimant into created wrapped document", () => {
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
    });

    describe("/POST Create certificate for plot by given information", () => {
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
            .get("/api/v2/doc/exists")
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

    describe("/PUT Update certificate for plot by given information", () => {
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

    describe("/DELETE Revoke certificate for plot by given information", () => {
        it("It should return 'Missing parameters error'", (done) => {
            chai.request(server)
                .delete("/resolver/commonlands/document/certificate")
                .send({})
                .end((err, res) => {
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

        it("It should return 'Invalid DID'", (done) => {
            chai.request(server)
                .delete("/resolver/commonlands/document/certificate")
                .send({ did: "123" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("error_code")
                        .equal(ERRORS.INVALID_DID.error_code);
                    res.body.should.have.property("error_message");
                    done();
                });
        });
    });
});
