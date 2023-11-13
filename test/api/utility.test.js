import chai from "chai";
import chaiHttp from "chai-http";
import server from "../../server.js";
import { ERRORS } from "../../src/configs/errors/error.constants.js";

let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe("UTILITY", function () {
    this.timeout(0);

    describe("/POST unsalt data", () => {
        it('it should return "Missing parameters" error', (done) => {
            chai.request(server)
                .post("/resolver/utility/unsalt")
                .send({})
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error_code");
                    res.body.should.have.property("error_message");
                    expect(res.body.error_code).equal(
                        ERRORS.MISSING_PARAMETERS.error_code
                    );
                    done();
                });
        });
        it('it should return "Unsalted data successfully!"', (done) => {
            chai.request(server)
                .post("/resolver/utility/unsalt")
                .send({
                    data: "0x1234567890abcdef",
                })
                .end((error, res) => {
                    res.body.should.be.a("object");
                    res.should.have.status(200);
                    res.body.should.have.property("success");
                    res.body.should.have.property("status_message");
                    res.body.should.have.property("data");
                    done();
                });
        });
    });
});
