require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../server");
const { ERRORS } = require("../core/constants");
const { isSameError } = require("../core/index");

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe("DID Controller - CREDENTIAL", function () {
    this.timeout(0);

    describe("/POST create new a new credential", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .post("/resolver/credential")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        it("it should return 'invalid input error' as the did param is invalid", (done) => {
            chai.request(server)
                .post("/resolver/credential")
                .send({
                    did: "INVALID_DID",
                    credential: { invalid_field: "..." },
                    config: { data: 100 },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).equal(
                        true
                    );

                    done();
                });
        });

        it("it should return 'invalid input error' as the credential structure (schema) is invalid", (done) => {
            chai.request(server)
                .post("/resolver/credential")
                .send({
                    did: "did:method:Kukulu:file_name",
                    credential: { invalid_field: "..." },
                    config: { data: 100 },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(isSameError(res.body, ERRORS.INVALID_INPUT)).equal(
                        true
                    );

                    done();
                });
        });
    });

    describe("/GET get a credential", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .get("/resolver/credential")
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

    describe("/PUT update a credential", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .put("/resolver/credential")
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
});
