import chai from "chai";
import chaiHttp from "chai-http";
import nock from "nock";

import server from "../../server.js";
import { ERRORS } from "../../src/config/errors/error.constants.js";
import { env } from "../../src/config/constants.js";
import { CONTROLLER_RESPONSE, CARDANO_RESPONSES } from "../mockData.js";

chai.use(chaiHttp);
let should = chai.should();
let expect = chai.expect;

describe("Contract API", function () {
    this.timeout(0);
    describe("/POST create contract for Commonlands", () => {
        it("It should return 'Missing parameters' error", (done) => {
            chai.request(server)
                .post("/resolver/contract")
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
                .post("/resolver/contract")
                .send({
                    wrappedDoc: {},
                    metadata: {},
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("error_code")
                        .equal(ERRORS.INVALID_INPUT.error_code);
                    res.body.should.have.property("error_message");
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from controller' when user call to check document is existed", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    wrappedDoc: {
                        _id: "123",
                    },
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_EXISTED);
        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from controller' when user call to get content of document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    wrappedDoc: {
                        _id: "123",
                    },
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_EXISTED);
        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return existed document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    wrappedDoc: {
                        _id: "123",
                    },
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.not.have.property("error_code");
                    res.body.should.not.have.property("error_message");
                    res.body.should.not.have.property("error_detail");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify(CONTROLLER_RESPONSE.SUCCESS.wrappedDoc)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_NOT_EXISTED);
        nock(env.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.ERROR_RESPONSE);
        it("It should return 'Error from Cardano service' when user call to get hash of document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    wrappedDoc: {
                        _id: "123",
                    },
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify(ERRORS.CANNOT_MINT_NFT)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_NOT_EXISTED);
        nock(env.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(env.DID_CONTROLLER)
            .post("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller' when user call to create document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    wrappedDoc: {
                        _id: "123",
                    },
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_NOT_EXISTED);
        nock(env.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(env.DID_CONTROLLER)
            .post("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller' when user call to get did of document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    wrappedDoc: {
                        _id: "123",
                    },
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });
        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_NOT_EXISTED);
        nock(env.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(env.DID_CONTROLLER)
            .post("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(env.DID_CONTROLLER)
            .put("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller' when user call to update did of document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    wrappedDoc: {
                        _id: "123",
                    },
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_NOT_EXISTED);
        nock(env.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(env.DID_CONTROLLER)
            .post("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(env.DID_CONTROLLER)
            .put("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return 'Error from Controller' when user call to update did of document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    wrappedDoc: {
                        _id: "123",
                    },
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.not.have.property("error_code");
                    res.body.should.not.have.property("error_message");
                    res.body.should.not.have.property("error_detail");
                    res.body.should.have.property("did").to.be.a("string");
                    done();
                });
        });
    });

    describe("/GET Get contract by given did", () => {
        it("It should return 'Invalid did syntax'", (done) => {
            chai.request(server)
                .get("/resolver/contract/123")
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

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller' when server request to get did of document", (done) => {
            chai.request(server)
                .get("/resolver/contract/did:example:ethr:0x123")
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

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return 'Object include hash and did of request document's did'", (done) => {
            chai.request(server)
                .get("/resolver/contract/did:example:ethr:0x123")
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

    describe("/PUT Update contract did document by given metadata", () => {
        it("It should return 'Missing parameters' error", (done) => {
            chai.request(server)
                .put("/resolver/contract")
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

        it("It should return 'Invalid' due to to input did is not valid", (done) => {
            chai.request(server)
                .put("/resolver/contract")
                .send({
                    did: "invalid-did",
                    metadata: {},
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(ERRORS.INVALID_DID)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller' when server request to get did of document", (done) => {
            chai.request(server)
                .put("/resolver/contract")
                .send({
                    did: "did:example:ethr:0x123",
                    metadata: {},
                })
                .end((err, res) => {
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.GET_DID_DOCUMENT_SUCCESS);
        nock(env.DID_CONTROLLER)
            .put("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller' when user call to update did of document", (done) => {
            chai.request(server)
                .put("/resolver/contract")
                .send({
                    did: "did:example:ethr:0x123",
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.GET_DID_DOCUMENT_SUCCESS);
        nock(env.DID_CONTROLLER)
            .put("/api/v2/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return 'Updated is true' whenever update did of document success", (done) => {
            chai.request(server)
                .put("/resolver/contract")
                .send({
                    did: "did:example:ethr:0x123",
                    metadata: {
                        status: "pending",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.not.have.property("error_code");
                    res.body.should.not.have.property("error_message");
                    res.body.should.not.have.property("error_detail");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify({
                            updated: true,
                        })
                    );
                    done();
                });
        });
    });

    describe("/POST Sign contract by given did", () => {
        it("It should return 'Missing parameters' error", (done) => {
            chai.request(server)
                .post("/resolver/contract/sign")
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
                .post("/resolver/contract/sign")
                .send({
                    contract: {},
                    claimant: {},
                    role: "borrower",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("error_code")
                        .equal(ERRORS.INVALID_INPUT.error_code);
                    res.body.should.have.property("error_message");
                    done();
                });
        });

        it("It should return 'Invalid DID' because the given certificate did is not valid", (done) => {
            chai.request(server)
                .post("/resolver/contract/sign")
                .send({
                    contract: "",
                    claimant: {
                        certificateDid: "invalid-cert-did",
                        seedPhrase: "",
                        userDid: "",
                    },
                    role: "borrower",
                })
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
