require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../server");
const { ERRORS } = require("../core/constants");
const { isSameError } = require("../core/index");

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe("Cardano Service", function () {
    this.timeout(0);

    describe("/GET get NFTs", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .get("/resolver/nfts")
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

    describe("/GET verify hash", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .get("/resolver/hash/verify")
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

    describe("/GET verify signature", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .get("/resolver/signature/verify")
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
