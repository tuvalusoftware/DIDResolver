import chai from "chai";
import chaiHttp from "chai-http";
import nock from "nock";

import server from "../../server.js";
import { ERRORS } from "../../src/config/errors/error.constants.js";
import { env } from "../../src/config/constants.js";
import {
    CONTROLLER_RESPONSE,
    WRAPPED_DOCUMENT_REQUEST,
    TASK_QUEUE_RESPONSE,
} from "../mockData.js";

chai.use(chaiHttp);
let should = chai.should();
let expect = chai.expect;

describe("DOCUMENT", function () {
    this.timeout(0);

    describe("/GET Get document by given did", () => {
        it("It should return 'Invalid did syntax'", (done) => {
            chai.request(server)
                .get("/resolver/commonlands/document/123")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).to.equal(
                        ERRORS.INVALID_DID.error_code
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.ERROR);
        it("It should return 'Error from Controller' when server request to get did of document", (done) => {
            chai.request(server)
                .get("/resolver/commonlands/document/did:example:ethr:0x123")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify(CONTROLLER_RESPONSE.ERROR)
                    );
                    done();
                });
        });

        nock(env.DID_CONTROLLER)
            .get("/api/v2/doc")
            .query(
                (object) => object.companyName && object.fileName && object.only
            )
            .reply(200, CONTROLLER_RESPONSE.SUCCESS);
        it("It should return 'Object include hash and did of request document's did'", (done) => {
            chai.request(server)
                .get("/resolver/commonlands/document/did:example:ethr:0x123")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.not.have.property("error_code");
                    res.body.should.not.have.property("error_message");
                    res.body.should.not.have.property("error_detail");
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify({
                            hash: CONTROLLER_RESPONSE.SUCCESS.wrappedDoc
                                .signature.targetHash,
                            did: "did:example:ethr:0x123",
                        })
                    );
                    done();
                });
        });
    });
});
