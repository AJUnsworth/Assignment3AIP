const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../api/app");
const should = chai.should();
const User = require("../api/models/user");

chai.use(chaiHttp);

describe('User', function () {

    afterEach((done) => {
        User.deleteMany({ username: new RegExp("test") }, (_error) => {
            done();
        });
    });

    describe('Registration', function () {
        it('should create a new user when details are valid', function (done) {
            let user = {
                "username": "test123",
                "email": "test@testers123.com",
                "password": "check123",
                "confirmPassword": "check123"
            };

            chai.request(app)
                .post('/users/register')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should not create a new user when email already exists in the database', function (done) {
            let user = {
                "username": "test123",
                "email": "test@testers123.com",
                "password": "check123",
                "confirmPassword": "check123"
            };

            let user2 = {
                "username": "123test",
                "email": "test@testers123.com",
                "password": "123check",
                "confirmPassword": "123check"
            };

            chai.request(app)
                .post('/users/register')
                .send(user)
                .end(function (err, res) {
                    chai.request(app).post('/users/register')
                        .send(user2)
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.body.email.should.be.eql("Email address is already registered");
                            done();
                        })
                });
        });

        it('should not create a new user when username already exists in the database', function (done) {
            let user = {
                "username": "test123",
                "email": "test@testers123.com",
                "password": "check123",
                "confirmPassword": "check123"
            };

            let user2 = {
                "username": "test123",
                "email": "123test@testers123.com",
                "password": "123check",
                "confirmPassword": "123check"
            };

            chai.request(app)
                .post('/users/register')
                .send(user)
                .end(function (err, res) {
                    chai.request(app).post('/users/register')
                        .send(user2)
                        .end(function (err, res) {
                            res.should.have.status(400);
                            res.body.username.should.be.eql("Username is already registered");
                            done();
                        })
                });
        });

    });
});