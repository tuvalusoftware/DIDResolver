require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../../server");
const { ERRORS } = require("../../core/constants");
const { isSameError } = require("../../core/index");

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

const AUTH_SERVICE_TOKEN = process.env.AUTH_SERVICE_TOKEN;

const TEST_COMPANY_NAME = "__TEST__COMPANY__NAME";
const DID_DATA = {
    publicKey: "sdfghjkhgfdfghj234567wedrfghjnbvfr56yhbfrty",
    did: "did:fuixlabs:companyName:publicKey",
    data: {
        name: "John Sad",
        organizationName: "organizationName1",
        organizationMail: "organizationMail1",
        organizationPhoneNumber: "organizationPhoneNumber1",
        organizationAddress: "organizationAddress1",
        website: "https://johnsad.com",
        issuer: "true",
    },
};

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
    });
});
