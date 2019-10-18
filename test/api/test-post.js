const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../api/app");
const expect = chai.expect;
const User = require("../../api/models/user");
const Post = require("../../api/models/post");
const should = chai.should();

chai.use(require("chai-sorted"));
chai.use(chaiHttp);

describe('Post', function () {

    describe('Sort By Methods', function () {
        it('should return posts in order of most recent to oldest', function (done) {

            chai.request(app)
                .get('/api/posts/latest')
                .end(function (err, res) {
                    res.should.have.status(200);
                    expect([res]).to.be.descendingBy("createdAt");
                    done();
                });
        });

        it('should return posts in order of most reacted to least reacted', function (done) {

            chai.request(app)
                .get('/api/posts/popular')
                .end(function (err, res) {
                    res.should.have.status(200);
                    expect([res]).to.be.descendingBy("totalReactions");
                    done();
                });
        });
    });
});

