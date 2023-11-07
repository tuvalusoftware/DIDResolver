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

describe("VERIFIER", function () {
    this.timeout(0);

    describe("/POST verify plot certificate", () => {
        it("It should 'Missing parameters'", (done) => {
            chai.request(server)
                .post("/resolver/verify/certificate")
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
                .post("/resolver/verify/certificate")
                .send({
                    did: "invalid-did",
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

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller'", (done) => {
            chai.request(server)
                .post("/resolver/verify/certificate")
                .send({ did: "did:example:ethers:0x1234" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
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
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);

        nock(env.CARDANO_SERVICE)
            .post("/api/v2/fetch/nft")
            .reply(200, CARDANO_RESPONSES.ERROR_RESPONSE);
        it("It should return 'Error from Cardano'", (done) => {
            chai.request(server)
                .post("/resolver/verify/certificate")
                .send({
                    did: "did:example:ethers:0x1234",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(ERRORS.CANNOT_FETCH_NFT)
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
        nock(env.CARDANO_SERVICE)
            .post("/api/v2/fetch/nft")
            .reply(200, CARDANO_RESPONSES.ENDORSEMENT_CHAIN_RESPONSE);
        nock(env.CARDANO_SERVICE)
            .post("/api/v2/fetch/nft")
            .reply(200, CARDANO_RESPONSES.ENDORSEMENT_CHAIN_RESPONSE);

        it("It should return 'Error is not the lastest version from Controller'", (done) => {
            chai.request(server)
                .post("/resolver/verify/certificate")
                .send({
                    did: "did:example:ethers:0x1234",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("error_code")
                        .equal(
                            ERRORS.DOCUMENT_IS_NOT_LASTEST_VERSION.error_code
                        );
                    res.body.should.have.property("error_message");
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        nock(env.CARDANO_SERVICE)
            .post("/api/v2/fetch/nft")
            .reply(200, CARDANO_RESPONSES.ENDORSEMENT_CHAIN_RESPONSE);
        nock(env.CARDANO_SERVICE)
            .post("/api/v2/fetch/nft")
            .reply(200, CARDANO_RESPONSES.LASTEST_VERSION_RESPONSE);
        it("It should return 'isValid is true'", (done) => {
            chai.request(server)
                .post("/resolver/verify/certificate")
                .send({
                    did: "did:example:ethers:0x1234",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("valid").equal(true);
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    describe("/Post verify verifiable credential", () => {
        it("It should 'Missing parameters'", (done) => {
            chai.request(server)
                .post("/resolver/verify/credential")
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("error_code")
                        .equal(ERRORS.MISSING_PARAMETERS.error_code);
                    res.body.should.have.property("error_message");
                    done();
                });
        });

        it("It should return 'Invalid DID'", (done) => {
            chai.request(server)
                .post("/resolver/verify/credential")
                .send({
                    did: "invalid-did",
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

        nock(env.DID_CONTROLLER)
            .get("/api/v2/credential/did:example:ethers:0x1234")
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller'", (done) => {
            chai.request(server)
                .post("/resolver/verify/credential")
                .send({ did: "did:example:ethers:0x1234" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/credential/did:example:ethers:0x1234")
            .reply(200, CONTROLLER_RESPONSE.VERIFIABLE_CREDENTIAL);
        it("It should return 'isValid is true'", (done) => {
            chai.request(server)
                .post("/resolver/verify/credential")
                .send({
                    did: "did:example:ethers:0x1234",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("valid").equal(true);
                    res.body.should.have.property("data");
                    done();
                });
        });
    });
});
