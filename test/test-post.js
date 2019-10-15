const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../api/app");
const expect = chai.expect;
const should = chai.should();
const Post = require("../api/models/post");
const User = require("../api/models/user");
const request = require('supertest');
const fs = require('fs');

chai.use(require("chai-sorted"));
chai.use(chaiHttp);

describe('Post', function () {

    describe('Sort By Methods', function () {
        it('should return posts in order of most recent to oldest', function (done) {

            chai.request(app)
                .get('/post/getThumbnails')
                .end(function (err, res) {
                    res.should.have.status(200);
                    expect([res]).to.be.descendingBy("createdAt");
                    done();
                });
        });

        it('should return posts in order of most reacted to least reacted', function (done) {

            chai.request(app)
                .get('/post/getPopular')
                .end(function (err, res) {
                    res.should.have.status(200);
                    expect([res]).to.be.descendingBy("totalReactions");
                    done();
                });
        });
    });

    /* describe('Post methods', function () {
        let user = {
            username: "johnsmith",
            password: "123Test",
        }

        let authenticatedUser = request.agent(app);

        beforeEach((done) => {
            User.deleteOne({}, (err) => {
                // Login a user
                User.create([
                    {  "username": "johnsmith", "email": "johnsmith@gmail.com", "password": "$2a$10$Djz5VKgYz2w/tfJrVmJ7/OvtQOAKDzqS.MttUNSVWHRCaKo3XaJXi", "likedPosts": [], "reportedPosts": []},
                    ], function (err) {
                    authenticatedUser
                        .post('/user/login')
                        .send(user)
                        .end(function (err, res) {
                            res.should.have.status(200);
                            user._id = res.body._id;
                            done();
                        }
                        );
    
                });
            });
        });

        it('should post an image', function (done) {
            async () => {
                const response = await chai.request(app)
                    .post('/post/create')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .attach('imageUrl',
                        fs.readFileSync('test/testimg.jpg'), 'testimg.jpg');
                expect(response.body).to.be.an('object');
                expect(response.body.status).to.equal(200);
                done();
            }
        });
    }); */
});

