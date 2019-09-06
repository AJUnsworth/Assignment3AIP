let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../api/app");
let should = chai.should();
let User = require("../api/models/user");

chai.use(chaiHttp);

describe('User', function() {
    const api = chai.request(app);

    beforeEach((done) => {
        User.deleteOne({ username: "test123"}, (_error) => {
            done();
        });
    });

    describe('Registration', function() {
        it('should create a new user when details are valid', function(done) {
            let user = {
                "username": "test123",
                "email": "test@testers123.com",
                "password": "check123",
                "confirmPassword": "check123"
            };

            api
                .post('/users/register')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
    });
})