const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../api/app");
const expect = chai.expect;
const should = chai.should();
const Post = require("../../api/models/post");
const User = require("../../api/models/user");
const request = require("supertest");
const fs = require("fs");

chai.use(require("chai-sorted"));
chai.use(chaiHttp);

describe("Post", function () {

    describe("Sort By Methods", function () {
        it("should return posts in order of most recent to oldest", function (done) {

            chai.request(app)
                .get("/posts/getThumbnails")
                .end(function (err, res) {
                    res.should.have.status(200);
                    expect([res]).to.be.descendingBy("createdAt");
                    done();
                });
        });

        it("should return posts in order of most reacted to least reacted", function (done) {

            chai.request(app)
                .get("/posts/getPopular")
                .end(function (err, res) {
                    res.should.have.status(200);
                    expect([res]).to.be.descendingBy("totalReactions");
                    done();
                });
        });
    });
});

