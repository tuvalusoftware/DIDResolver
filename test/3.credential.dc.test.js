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
    CREDENTIAL_DATA,
} = require("./mockData");

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

        // Mock Server Response
        // Cardano Service: Fetch NFT
        nock(SERVERS.CARDANO_SERVICE)
            .post("/api/v2/fetch/nft", (body) => body.policyId)
            .reply(200, CARDANO_DATA.LIST_OF_NFTS);

        // DID Controller: Get wrapped doc and its DID doc
        nock(SERVERS.DID_CONTROLLER)
            .get("/api/doc")
            .query((queryObj) => queryObj.companyName && queryObj.fileName)
            .reply(200, DOC_DATA.SINGLE_DOC);

        // Auth service: Verify user's permission from access token
        nock(SERVERS.AUTHENTICATION_SERVICE)
            .get("/api/auth/verify")
            .reply(200, AUTH_DATA.USER_ADDR_FROM_TOKEN);

        // Cardano Service: Create NFT
        nock(SERVERS.CARDANO_SERVICE)
            .post(
                "/api/v2/credential",
                (body) => body.config && body.credential
            )
            .reply(200, CARDANO_DATA.MINT_NFT_CREDENTIAL);

        // DID Controller: Save credential
        nock(SERVERS.DID_CONTROLLER)
            .post("/api/credential", (body) => body.hash && body.content)
            .reply(201, DID_CONTROLLER_OPERATION_STATUS.SAVE_SUCCESS);

        it("it should return a success message", (done) => {
            chai.request(server)
                .post("/resolver/credential")
                .send(OTHER_DATA.CREATE_CREDENTIAL_ARGS)
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

        // Mock Server Response
        nock(SERVERS.DID_CONTROLLER)
            .get("/api/credential")
            .query((queryObj) => queryObj.hash)
            .reply(200, CREDENTIAL_DATA.SINGLE_CREDENTIAL);

        it("it should return a credential", (done) => {
            chai.request(server)
                .get("/resolver/credential")
                .set("hash", "123456789qwertyuiwertyuio3456789dfgh")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(JSON.stringify(res.body)).equal(
                        JSON.stringify(CREDENTIAL_DATA.SINGLE_CREDENTIAL)
                    );

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

        // DID Controller: Update credential
        nock(SERVERS.DID_CONTROLLER)
            .put("/api/credential", (body) => body.hash && body.content)
            .reply(200, DID_CONTROLLER_OPERATION_STATUS.UPDATE_SUCCESS);

        it("it should return a success message", (done) => {
            chai.request(server)
                .put("/resolver/credential")
                .send({
                    originCredentialHash: "ghjk_rtyuiocvbnm456dfghj",
                    credentialContent: {
                        issuer: "did:company:owner_public_key",
                        subject: "did:company2:other_public_key",
                        credentialSubject: {
                            object: "did:some_method:an_wrapped_doc_did",
                            action: {
                                code: 3000,
                                value: "changeHolderShip",
                            },
                        },
                        signature:
                            "12345678986543234567qwertytwq231234567876543sdfghgfds",
                        metadata: {
                            dateCreated: "22/06/2022",
                            some_fields: "some_data",
                        },
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
});
