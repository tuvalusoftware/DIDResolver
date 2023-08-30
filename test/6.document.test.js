import chai from "chai";
import chaiHttp from "chai-http";
import nock from "nock";
import "dotenv/config";

import server from "../server.js";
import { ERRORS, SERVERS } from "../core/constants.js";
import { isSameError } from "../core/index.js";

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe("Commonlands document", function () {
  this.timeout(0);
  describe("/POST create new a new document", () => {
    it('It should return "missing params error" as the params are not provided', (done) => {
      chai
        .request(server)
        .post("/resolver/commonlands/document")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(
            isSameError(res.body, {
              ...ERRORS?.MISSING_PARAMETERS,
              detail: "Not found: plot owner",
            })
          ).equal(true);
          done();
        });
    });
    nock(SERVERS.DID_CONTROLLER)
      .get("/api/doc/exists")
      .query({
        company: "commonlands",
        did: "did:fuixlabs:companyName:publicKey",
      })
      .reply(200, {});
  });
});
