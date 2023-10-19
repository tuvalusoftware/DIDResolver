import chai from "chai";
import chaiHttp from "chai-http";
import nock from "nock";

import server from "../../server.js";
import { ERRORS } from "../../src/config/errors/error.constants.js";
import { SERVERS } from "../../src/config/constants.js";
import {
    CONTROLLER_RESPONSE,
    CARDANO_ERROR_RESPONSE,
    CARDANO_RESPONSES,
} from "../mockData.js";

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

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from controller' when user call to check document is existed", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({})
                .end((err, res) => {
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

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc")
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

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc")
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
});
