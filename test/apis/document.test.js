import chai from "chai";
import chaiHttp from "chai-http";
import chaiSpies from "chai-spies";
import nock from "nock";
import server from "../../server.js";
import {
    isSameError,
    checkValidationOfDidByCompanyName,
} from "../../src/utils/index.js";
import { ERRORS } from "../../src/configs/errors/error.constants.js";
import { env } from "../../src/configs/constants.js";
import { VALID_DOCUMENT_NAME_TYPE } from "../../src/fuixlabs-documentor/constants/type.js";
import { deleteDB } from "../../src/scripts/index.js";
import Rabbit from "../RabbitMQ.js";
import { ConsumerServiceMock } from "../mocks/Consumer.mock.js";

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiSpies);

const controllerUrl = env.DID_CONTROLLER;

const wrappedDocData = {
    wrappedDoc: {
        _id: "test_id",
    },
    fileName: "test_fileName",
    type: VALID_DOCUMENT_NAME_TYPE[0].name,
    companyName: "test_company",
};

describe("Document API", async function () {
    this.timeout(5000);

    this.beforeAll(async () => {
        await deleteDB();
        ConsumerServiceMock();
        // do something before all tests
    });

    this.afterAll(async () => {
        await deleteDB();
    });

    describe("POST /api/v1/document", () => {
        it("it should 'missing parameters' error due to missing all of required parameters in req body", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).to.be
                        .true;
                    done();
                });
        });
        it("it should 'missing parameters' due to missing companyName in req.body", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    wrappedDoc: {},
                    fileName: "test",
                    type: "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).to.be
                        .true;
                    done();
                });
        });
        it("it should 'missing parameters' due to missing type in req.body", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    wrappedDoc: {},
                    fileName: "test",
                    companyName: "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).to.be
                        .true;
                    done();
                });
        });
        it("it should 'missing parameters' due to missing fileName in req.body", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    wrappedDoc: {},
                    type: "test",
                    companyName: "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).to.be
                        .true;
                    done();
                });
        });
        it("it should 'missing parameters' due to missing wrappedDoc in req.body", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    type: "tets",
                    fileName: "test",
                    companyName: "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).to.be
                        .true;
                    done();
                });
        });
        it("it should return 'missing parameters' due to missing chain in req.body", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    wrappedDoc: {},
                    fileName: "test",
                    type: "test",
                    companyName: "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).to.be
                        .true;
                    done();
                });
        });
        it("it should return 'validation' error due to chain is not 'cardano' or 'stellar'", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    wrappedDoc: {},
                    fileName: "test",
                    type: "test",
                    companyName: "test",
                    chain: "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).to.be
                        .true;
                    done();
                });
        })
        it("it should return 'validation' error due to wrappedDoc is not an object", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    wrappedDoc: "test",
                    fileName: "test",
                    type: "test",
                    companyName: "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).to.be
                        .true;
                    done();
                });
        });
        it("it should return 'validation' error due to content of wrappedDoc in req.body is invalid", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    wrappedDoc: {},
                    fileName: "test",
                    type: "test",
                    companyName: "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).to.be
                        .true;
                    done();
                });
        });

        nock(controllerUrl)
            .get(`/api/v2/doc/exists`)
            .query({
                companyName: "test_company",
                fileName: "test_fileName",
            })
            .reply(200, {
                data: {
                    isExists: false,
                },
            });
        it("it should return 'invalid type' error due to type of document is not valid", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    wrappedDoc: {
                        _id: "test_id",
                        testParam: "test_param",
                    },
                    fileName: "test_fileName",
                    type: "test_type",
                    companyName: "test_company",
                    network: "cardano",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(
                        isSameError(res.body, ERRORS.DOCUMENT_TYPE_IS_NOT_VALID)
                    ).to.be.true;
                    done();
                });
        });

        nock(controllerUrl)
            .get(`/api/v2/doc/exists`)
            .query({
                companyName: "test_company",
                fileName: "test_fileName",
            })
            .reply(200, {
                data: {
                    isExists: false,
                },
            });

        nock(controllerUrl)
            .get(`/api/v2/doc/exists`)
            .query({
                companyName: "test_company",
                fileName: "test_fileName",
            })
            .reply(200, {
                data: {
                    isExists: false,
                },
            });

        it("it should return 'successfully saved' message", (done) => {
            chai.request(server)
                .post("/api/v1/document")
                .send({
                    ...wrappedDocData,
                    network: "cardano",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("txHash").to.be.a("string");
                    res.body.should.have
                        .property("assetName")
                        .to.be.a("string");
                    res.body.should.have.property("did").to.be.a("string");
                    expect(
                        checkValidationOfDidByCompanyName(
                            res.body.did,
                            wrappedDocData.companyName
                        )
                    ).to.be.true;
                    done();
                });
        });
    });
});
