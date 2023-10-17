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

        it("It should return 'Invalid input' due to the given content of contract is invalid", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    contract: {},
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(ERRORS.INVALID_INPUT)
                    );
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return error from 'Controller server' when user call to check the existence", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    contract: {
                        _id: "123",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_EXISTED);
        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return error from 'Controller server' when user call to get the document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    contract: {
                        _id: "123",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_EXISTED);
        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return content of wrapped document whenever document is existed", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    contract: {
                        _id: "123",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.SUCCESS.wrappedDoc)
                    );
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_NOT_EXISTED);
        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_ERROR_RESPONSE);
        it("It should return error from 'Cardano server' when user request to store token", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    contract: {
                        _id: "123",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(ERRORS.CANNOT_MINT_NFT)
                    );
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_NOT_EXISTED);
        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/doc")
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller' when user request to store document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    contract: {
                        _id: "123",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc/exists")
            .query((object) => object.companyName && object.fileName)
            .reply(200, CONTROLLER_RESPONSE.IS_NOT_EXISTED);
        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/hash-random")
            .reply(200, CARDANO_RESPONSES.CONFIG_RESPONSE);
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/doc")
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return did from Controller when user request to store document", (done) => {
            chai.request(server)
                .post("/resolver/contract")
                .send({
                    contract: {
                        _id: "123",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("did").be.a("string");
                    done();
                });
        });
    });
});
