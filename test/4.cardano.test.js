require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const nock = require("nock");

const server = require("../server");
const { ERRORS, SERVERS } = require("../core/constants");
const { isSameError } = require("../core/index");
const {
    AUTH_DATA,
    CARDANO_DATA,
    DOC_DATA,
    DID_CONTROLLER_OPERATION_STATUS,
    OTHER_DATA,
} = require("./mockData");

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

        // Cardano Service: Fetch NFT
        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/fetch/nft", (body) => body.policyId)
            .reply(200, CARDANO_DATA.NFT);

        it("it should return data of an NFT", (done) => {
            chai.request(server)
                .get("/resolver/nfts")
                .set("policyid", "1234567890")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CARDANO_DATA.NFT.data)
                    );

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

        // Cardano Service: Fetch NFT
        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/fetch/nft", (body) => body.policyId || body.asset)
            .reply(200, CARDANO_DATA.NFT);

        it("it should return data of an NFT that correspond with the given hash", (done) => {
            chai.request(server)
                .get("/resolver/hash/verify")
                .set("hashofdocument", "1234567890")
                .set("policyid", "98765432")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CARDANO_DATA.NFT.data)
                    );

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

        // Cardano Service: Verify Signature
        nock(SERVERS.CARDANO_SERVICE)
            .post(
                "/api/v2/verify/signature",
                (body) =>
                    body.address && body.payload && body.signature && body.key
            )
            .reply(200, CARDANO_DATA.SIGNATURE_VERIFICATION);

        it("it should return a boolean value", (done) => {
            chai.request(server)
                .get("/resolver/signature/verify")
                .set("address", "1234567890qwertyuiop")
                .set("payload", "mnbvcxzasdfghjkl")
                .set("signature", "qwertyuioplkjhgfdsa")
                .set("key", "zaqwsxcderfvbgt")
                .end((err, res) => {
                    res.should.have.status(200);

                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CARDANO_DATA.SIGNATURE_VERIFICATION.data)
                    );

                    done();
                });
        });
    });
});
