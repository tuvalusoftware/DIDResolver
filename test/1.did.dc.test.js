require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const nock = require("nock");

const server = require("../server");
const { ERRORS, SERVERS } = require("../core/constants");
const { isSameError } = require("../core/index");
const { DID_DATA, DID_CONTROLLER_OPERATION_STATUS } = require("./mockData");

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe("DID Controller - DID", function () {
    this.timeout(0);

    describe("/POST create new a new DID profile", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .post("/resolver/did")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        // Mock Server Response
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/did", (body) => body.companyName && body.publicKey)
            .reply(200, DID_CONTROLLER_OPERATION_STATUS.SAVE_SUCCESS);

        it("it should return a success message", (done) => {
            chai.request(server)
                .post("/resolver/did")
                .send({
                    companyName: "PAPERLESS_COMPANY2",
                    publicKey: "user's public key",
                    did: "did:fuixlabs:companyName:publicKey",
                    data: {
                        name: "Jone Sad",
                        organizationName: "organizationName1",
                        organizationMail: "organizationMail1",
                        organizationPhoneNumber: "organizationPhoneNumber1",
                        organizationAddress: "organizationAddress1",
                        website: "https://johnsad.com",
                        issuer: "true",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(
                            DID_CONTROLLER_OPERATION_STATUS.SAVE_SUCCESS
                        )
                    );

                    done();
                });
        });
    });

    describe("/GET get DID of an user", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .get("/resolver/did")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        it("it should return 'invalid string error' as the params contains invalid character", (done) => {
            chai.request(server)
                .get("/resolver/did")
                .query({ companyName: "#$%^&*(", publicKey: "@#$%^&*&^%$" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(isSameError(res.body, ERRORS.INVALID_STRING)).equal(
                        true
                    );

                    done();
                });
        });

        // Mock Server Response
        nock(SERVERS.DID_CONTROLLER)
            .get("/api/did")
            .query({ companyName: "COMPANY", publicKey: "someone_pk" })
            .reply(200, DID_DATA.SINGLE_DID);

        it("it get data of a DID", (done) => {
            chai.request(server)
                .get("/resolver/did")
                .query({ companyName: "COMPANY", publicKey: "someone_pk" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(DID_DATA.SINGLE_DID)
                    );

                    done();
                });
        });
    });

    describe("/GET get all DIDs of a company", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .get("/resolver/did/all")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        it("it should return 'invalid string error' as the params contains invalid character", (done) => {
            chai.request(server)
                .get("/resolver/did/all")
                .query({ companyName: "#$%^&*(" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(isSameError(res.body, ERRORS.INVALID_STRING)).equal(
                        true
                    );

                    done();
                });
        });

        // Mock Server Response
        nock(SERVERS.DID_CONTROLLER)
            .get("/api/did/all")
            .query({ companyName: "COMPANY", content: "include" })
            .reply(200, DID_DATA.DID_BY_COMPANY);

        it("it should return a list of file and its content", (done) => {
            chai.request(server)
                .get("/resolver/did/all")
                .query({ companyName: "COMPANY" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");

                    const count = res.body.filter(
                        (item) => item.name != undefined
                    ).length;
                    expect(count).equal(res.body.length);

                    done();
                });
        });
    });

    describe("/PUT update a DID profile", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .put("/resolver/did")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        // Mock Server Response
        nock(SERVERS.DID_CONTROLLER)
            .put("/api/did", (body) => body.companyName && body.publicKey)
            .reply(200, DID_CONTROLLER_OPERATION_STATUS.UPDATE_SUCCESS);

        it("it should return a success message", (done) => {
            chai.request(server)
                .put("/resolver/did")
                .send({
                    companyName: "PAPERLESS_COMPANY2",
                    publicKey: "user's public key",
                    did: "did:fuixlabs:companyName:publicKey",
                    data: {
                        updated: true,
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(
                            DID_CONTROLLER_OPERATION_STATUS.UPDATE_SUCCESS
                        )
                    );

                    done();
                });
        });
    });

    describe("/DELETE delete DID of an user", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .delete("/resolver/did")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        it("it should return 'invalid string error' as the params contains invalid character", (done) => {
            chai.request(server)
                .delete("/resolver/did")
                .send({ companyName: "#$%^&*(", publicKey: "@#$%^&*&^%$" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(isSameError(res.body, ERRORS.INVALID_STRING)).equal(
                        true
                    );

                    done();
                });
        });

        // Mock Server Response
        nock(SERVERS.DID_CONTROLLER)
            .delete("/api/did")
            .query({ companyName: "COMPANY", publicKey: "someone_pk" })
            .reply(200, DID_CONTROLLER_OPERATION_STATUS.DELETE_SUCCESS);

        it("it get data of a DID", (done) => {
            chai.request(server)
                .delete("/resolver/did")
                .send({ companyName: "COMPANY", publicKey: "someone_pk" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(
                            DID_CONTROLLER_OPERATION_STATUS.DELETE_SUCCESS
                        )
                    );

                    done();
                });
        });
    });
});
