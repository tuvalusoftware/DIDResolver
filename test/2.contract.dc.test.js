import chai from "chai";
import chaiHttp from "chai-http";
import nock from "nock";
import "dotenv/config";

import server from "../server.js";
import { SERVERS } from "../src/config/constants.js";
import { ERRORS } from "../src/config/errors/error.constants.js";
import { isSameError } from "../src/api/utils/index.js";
import {
  DID_DATA,
  DID_CONTROLLER_OPERATION_STATUS,
  AUTH_DATA,
} from "./mockData.js";

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe("DID Resolver - Contract", function () {
  this.timeout(0);

  describe("/POST create a new contract", () => {
    it('It should return "missing params error" as the params are not provided', (done) => {
      chai
        .request(server)
        .post("/resolver/contract")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(isSameError(res.body, ERRORS.MISSING_PARAMETERS)).equal(true);
          done();
        });
    });
    nock(SERVERS.AUTHENTICATION_SERVICE)
      .get("/api/auth/getRandomNumber")
      .reply(200, AUTH_DATA.GET_ACCESS_TOKEN);
    it('It should return "Bad request. Invalid input syntax." as the given contract structure is invalid', () => {
      chai
        .request(server)
        .post("/resolver/contract")
        .send({
          content: "DSADSA",
          id: "dsadsa",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(isSameError(res.body, ERRORS.INVALID_INPUT)).equal(true);
          done();
        });
    });
  });
});
