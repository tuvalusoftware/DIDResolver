require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const nock = require("nock");

const server = require("../server");
const { ERRORS, SERVERS } = require("../core/constants");
const { isSameError } = require("../core/index");
const {
  ALGORAND_DATA,
  AUTH_DATA,
  DOC_DATA,
  OTHER_DATA,
} = require("./mockData");

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe("", function () {
  this.timeout(0);

  describe("DID Resolver - Algorand verifying address testing", () => {
    it("It should return 'Missing params error' as the input params are not provided", (done) => {
      chai
        .request(server)
        .get("/resolver/auth/public-key/v2")
        .set("address", null)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(isSameError(res.body, ERRORS.MISSING_PARAMETERS)).equal(true);
          done();
        });
    });
    const sampleValidAlgorandAddress =
      "4NSPMTP4ZV7E6ZYPTQ25J4IH4HBSG53SKQT53LUJ25O7HDUPZSBLVUC23U";
    it("It should return 'isValidAddress=true' as the given address is valid Algorand address", (done) => {
      chai
        .request(server)
        .get("/resolver/auth/public-key/v2")
        .query("address", sampleValidAlgorandAddress)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(JSON.stringify(res.body)).equal(
            JSON.stringify({ isValidAddress: false })
          );
          done();
        });
    });
  });

  describe("DID Resolver - Algorand credential testing", () => {
    it("It should return 'Missing params error' as the input params are not provided", (done) => {
      chai
        .request(server)
        .post("/resolver/credential/v2")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(isSameError(res.body, ERRORS.MISSING_PARAMETERS)).equal(true);
          done();
        });
    });
    it("It should return 'invalid input error' as the did param is invalid", (done) => {
      chai
        .request(server)
        .post("/resolver/credential/v2")
        .send({
          did: "INVALID_DID",
          credential: {},
          config: {},
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(isSameError(res.body, ERRORS.INVALID_INPUT)).equal(true);
          done();
        });
    });
  });

  describe("DID Resolver - Algorand fetching nfts from Algorand testing", () => {
    nock(SERVERS.ALGORAND_SERVICE)
    .post("/api/v1/fetch/nft", (body) => body.assetId)
    .reply(200, ALGORAND_DATA.VERIFY_SUCCESS_HASH_RESULT);
    nock(SERVERS.ALGORAND_SERVICE)
      .post("/api/v1/fetch/nft", (query) => query.unitName && query.assetId)
      .reply(200, ALGORAND_DATA.VERIFY_SUCCESS_HASH_RESULT);
    it("It should return 'Missing params error' as the input params are not provided", (done) => {
      chai
        .request(server)
        .get("/resolver/nfts/v2")
        .set('unitName', '')
        .set('assetId', '')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
      });
  });

  describe("DID Resolver - Algorand verifying signature testing", () => {
    it("It should return 'Missing params error' as the input params are not provided", (done) => {
      chai
        .request(server)
        .post("/resolver/signature/verify/v2")
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(isSameError(res.body, ERRORS.MISSING_PARAMETERS)).equal(true);
          done();
        });
    });

    nock(SERVERS.ALGORAND_SERVICE)
      .post(
        "/api/v1/verify/signature",
        (body) => body.address && body.payload && body.signature
      )
      .reply(200, ALGORAND_DATA.VERIFY_UNSUCCESS_SIGNATURE_RESULT);
    it("It should return 'isValid=true' as the invalid signature's response of Algorand service", (done) => {
      chai
        .request(server)
        .post("/resolver/signature/verify/v2")
        .send({
          address: "address123456",
          payload: {
            address: "signAddress1",
          },
          signature: "signature12345",
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(JSON.stringify(res.body)).equal(
            JSON.stringify({ isValid: false })
          );
          done();
        });
    });

    nock(SERVERS.ALGORAND_SERVICE)
      .post(
        "/api/v1/verify/signature",
        (body) => body.address && body.payload && body.signature
      )
      .reply(200, ALGORAND_DATA.VERIFY_SUCCESS_SIGNATURE_RESULT);
    it("It should return 'isValid=true' as the valid signature's response of Algorand service", (done) => {
      chai
        .request(server)
        .post("/resolver/signature/verify/v2")
        .send({
          address: "address123456",
          payload: {
            address: "signAddress1",
          },
          signature: "signature12345",
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(JSON.stringify(res.body)).equal(
            JSON.stringify({ isValid: true })
          );
          done();
        });
    });
  });

  describe("DID Resolver - Algorand verifying hash of nft testing", () => {
    it("It should return 'Missing params error' as the input params are not provided", (done) => {
      chai
        .request(server)
        .post("/resolver/hash/verify/v2")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(isSameError(res.body, ERRORS.MISSING_PARAMETERS)).equal(true);
          done();
        });
    });

    nock(SERVERS.ALGORAND_SERVICE)
      .post("/api/v1/fetch/nft", (body) => body.assetId)
      .reply(200, ALGORAND_DATA.VERIFY_UNSUCCESS_HASH_RESULT);
    it("It should return 'isValid=false' as the given asset-id does not match any transactions asset-id on Algorand network", (done) => {
      chai
        .request(server)
        .post("/resolver/hash/verify/v2")
        .send({ assetId: "1234567890" })
        .end((err, res) => {
          res.should.have.status(200);
          expect(JSON.stringify(res.body)).equal(
            JSON.stringify({ isValid: false })
          );
          done();
        });
    });

    nock(SERVERS.ALGORAND_SERVICE)
      .post("/api/v1/fetch/nft", (body) => body.assetId)
      .reply(200, ALGORAND_DATA.VERIFY_SUCCESS_HASH_RESULT);
    it("It should return 'isValid=true' as the given asset-id is match one of transaction on Algorand", (done) => {
      chai
        .request(server)
        .post("/resolver/hash/verify/v2")
        .send({ assetId: "150852395" })
        .end((err, res) => {
          res.should.have.status(200);
          expect(JSON.stringify(res.body)).equal(
            JSON.stringify({ isValid: true })
          );
          done();
        });
    });
  });

  describe("DID Resolver - Algorand creating document testing", () => {
    it("It should return 'Missing params error' as the input params are not provided", (done) => {
      chai
        .request(server)
        .post("/resolver/wrapped-document/v2")
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(isSameError(res.body, ERRORS.MISSING_PARAMETERS)).equal(true);
          done();
        });
    });
    it("It should return 'Invalid did format' as the given user did of wrapped-document is invalid format", (done) => {
      chai
        .request(server)
        .post("/resolver/wrapped-document/v2")
        .send({
          wrappedDocument: {
            data: {
              did: "sample_invalid_did",
            },
          },
          issuerAddress: "",
        })
        .end((err, res) => {
          const errorResponse = {
            ...ERRORS.INVALID_INPUT,
            detail: "Invalid DID syntax. Check did element.",
          };
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(
            isSameError(JSON.stringify(res.body), JSON.stringify(errorResponse))
          ).equal(true);
          done();
        });
    });

    nock(SERVERS.AUTHENTICATION_SERVICE)
      .persist()
      .get("/api/auth/verify")
      .reply(200, AUTH_DATA.USER_ADDR_FROM_TOKEN_V2);
    it("It should return 'Permission denied' as the address of current access-token is different from given did of wrapped-document", (done) => {
      chai
        .request(server)
        .post("/resolver/wrapped-document/v2")
        .send({
          issuerAddress: "invalid_issuer_key",
          wrappedDocument: {
            data: {
              did: "did:fuixlabs:DOMINIUM_COMPANY_3:KOWRYYQTEOKT5WSXIGWE6QPGAHX4SS3JEZ3ASIQ74GGWPOXJRMEPVHLWAM",
            },
          },
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(isSameError(res.body, ERRORS.PERMISSION_DENIED)).equal(true);
          nock.cleanAll();
          done();
        });
    });

    // nock(SERVERS.AUTHENTICATION_SERVICE)
    //   .persist()
    //   .get("/api/auth/verify")
    //   .reply(200, AUTH_DATA.USER_ADDR_FROM_TOKEN_V2);
    // nock(SERVERS.DID_CONTROLLER)
    // .persist()
    //   .get("/api/doc/exists")
    //   .query((queryObj) => queryObj.companyName && queryObj.fileName)
    //   .reply(200, DOC_DATA.IS_EXIST);
    // it("Meo", (done) => {
    //   chai
    //     .request(server)
    //     .post("/resolver/wrapped-document/v2")
    //     .send({
    //       issuerAddress:
    //         "KOWRYYQTEOKT5WSXIGWE6QPGAHX4SS3JEZ3ASIQ74GGWPOXJRMEPVHLWAM",
    //       wrappedDocument: {
    //         data: {
    //           did: "did:fuixlabs:DOMINIUM_COMPANY_3:KOWRYYQTEOKT5WSXIGWE6QPGAHX4SS3JEZ3ASIQ74GGWPOXJRMEPVHLWAM",
    //         },
    //       },
    //     })
    //     .end((err, res) => {
    //       console.log(res.body);
    //       res.should.have.status(200);
    //       res.body.should.be.a("object");

    //       done();
    //     });
    // });
  });
});

// nock(SERVERS.ALGORAND_SERVICE)
// .post("/api/v1/fetch/nft", (body) => body.assetId)
// .reply(200, ALGORAND_DATA.VERIFY_UNSUCCESS_HASH_RESULT);
