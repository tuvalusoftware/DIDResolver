require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../server");
const { ERRORS } = require("../core/constants");
const { isSameError } = require("../core/index");

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

const VALID_WRAPPED_DOCUMENT = {
    wrappedDocument: {
        vesion: "https://schema.openattestation.com/2.0/schema.json",
        data: {
            name: "eb2ebfb2-62e6-4e89-b326-668f97d5f142:string:OpenCerts Certificate of Award",
            title: "978c3e0a-8335-4059-8653-998184adfc76:string:Test Title By Caps2",
            remarks:
                "9fd10ccf-5736-46b6-a62d-bc87533a03aa:string:Test Remarks By Caps",
            fileName:
                "d9a118d4-cd63-4a0d-8a2e-f04bdaa46c84:string:cover-letter",
            shippingInformation: {
                title: "8bd910c0-43cd-4617-9546-e40358e2e773:string:Name & Address of Shipping Agent/Freight Forwarder",
                countryName:
                    "d5229dab-5e92-40f7-8a41-856e81b02c36:string:VIET NAM",
                stress: "2bb33202-2870-425f-8256-a18363d0bf18:string:SG Freight",
                address:
                    "5a81e499-c348-4a91-952a-b86db2853f15:string:101 ORCHARD ROAD",
            },
            customInformation: {
                title: "bb256376-2b5f-495a-a87d-d60629147976:string:Demo custom",
                additionalAddress:
                    "a8a4d8e0-76b7-478f-8f0b-4a62d5eb9959:string:55 Newton Road",
                telephoneNumber:
                    "80588748-8ce1-427e-bb54-4543f03b8706:string:+84988888888",
            },
            declarationInformation: {
                title: "71b82cbd-1791-4552-9bd2-a29a00391ded:string:Declaration by Shipping Agent/Freight Forwarder",
                declarationName:
                    "7ba2fe68-0a6d-4990-b357-1248c3cebc9b:string:PETER LEE",
                designation:
                    "bdcf2607-698e-4778-b804-0dc50fa11f22:string:SHIPPING MANAGER",
                date: "73ef8807-7f67-48d3-8f62-f1f5ee36049f:string:12/07/2022",
            },
            certification: {
                title: "af5126ab-1494-42f4-ac74-14b7bb05da26:string:Declaration by Shipping Agent/Freight Forwarder",
                certificationName:
                    "174c25d4-a0af-4b78-8a5a-4392925f1caa:string:PETER LEE",
                designation:
                    "8d74597b-8223-4787-8069-5ee8cddb9895:string:SHIPPING MANAGER",
                date: "8e31c7dd-3ddc-43a3-a705-5c7b2dad1e02:string:12/07/2022",
            },
            companyName:
                "c173f71d-761f-45e5-b30e-9713eb8dc743:string:SAMPLE_COMPANY_NAME",
            intention: "87c3648b-f6a9-4ef2-bb0d-6aa920b38829:string:trade",
            did: "5e89e527-01e8-4b7e-8b8d-b3abf7d1d47d:string:did:fuixlabs:SAMPLE_COMPANY_NAME:cover-letter",
            issuers: [
                {
                    identityProofType: {
                        type: "360fb9cd-c072-4a5b-95e9-aa27c24f26fb:string:DID",
                        did: "4c6d4710-ca66-4052-b5c9-30841f12850f:string:did:fuixlabs:SAMPLE_COMPANY_NAME:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
                    },
                    address:
                        "434d4419-142b-4939-af21-cf035173eaa5:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
                },
            ],
        },
        signature: {
            type: "SHA3MerkleRoot",
            targetHash: "string",
            proof: [],
            merkleRoot: "string",
        },
        assetId: "",
        policyId: "",
    },
};

describe("DID Controller - DOC", function () {
    this.timeout(0);

    describe("/GET wrapped document", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .get("/resolver/wrapped-document")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        it("it should return 'invalid input syntax' as the DID param is invalid", (done) => {
            chai.request(server)
                .get("/resolver/wrapped-document")
                .set("did", "INVALID_DID")
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

    describe("/GET all wrapped documents belong to an user", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .get("/resolver/wrapped-document/user")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        it("it should return 'invalid input syntax' as the DID param is invalid", (done) => {
            chai.request(server)
                .get("/resolver/wrapped-document/user")
                .set("did", "INVALID_DID")
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

    describe("/GET check if a document exist", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .get("/resolver/wrapped-document/exist")
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

    describe("/POST save a new wrapped document", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .post("/resolver/wrapped-document")
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        it("it should return 'invalid input syntax' as the DID param is invalid", (done) => {
            chai.request(server)
                .post("/resolver/wrapped-document")
                .send({
                    wrappedDocument: {
                        data: { did: "INVALID_DID", other_data: {} },
                    },
                    issuerAddress: "345678987654ewdfghjkjhgfdertyu",
                    mintingNFTConfig: {
                        data: "dfghjkvcvb5678",
                        config: "5678765fgh",
                    },
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

    describe("/PUT validate a wrapped document data's structure (schema)", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .put("/resolver/wrapped-document/valid")
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .put("/resolver/wrapped-document/valid")
                .send(VALID_WRAPPED_DOCUMENT)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(res.body.valid).equal(true);

                    done();
                });
        });
    });

    describe("/PUT update DID document of wrapped document (transfer ownership, ...)", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .put("/resolver/wrapped-document/transfer")
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");

                    expect(
                        isSameError(res.body, ERRORS.MISSING_PARAMETERS)
                    ).equal(true);

                    done();
                });
        });

        it("it should return 'invalid input syntax' as the DID param is invalid", (done) => {
            chai.request(server)
                .put("/resolver/wrapped-document/transfer")
                .send({
                    did: "INVALID_DID",
                    didDoc: {
                        controller: ["owner_public_key", "holder_public_key"],
                        did: "did:method:companyName:something",
                        owner: "owner_public_key",
                        holder: "holder_public_key",
                        url: "document_name.document",
                    },
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

    describe("/GET search content in documents", () => {
        it("it should return 'missing params error' as the required params (company, search-string) are not provided", (done) => {
            chai.request(server)
                .get("/resolver/wrapped-document/search")
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

    describe("/DELETE revoke a wrapped document on Cardano network", () => {
        it("it should return 'missing params error' as the params are not provided", (done) => {
            chai.request(server)
                .delete("/resolver/wrapped-document/revoke")
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
