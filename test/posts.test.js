const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const mongoose = require("mongoose");
const Post = require('../src/models/Post');
const mockPosts = require('./__mocks__/posts');
const sinon = require('sinon');
const passport = require('passport');
const seedProfiles = require('./__mocks__/seed-profiles');
const seedPosts = require('./__mocks__/posts');
const errorMessages = require('../src/error-handling/strings');
const { addSeedPostsToDb }  = require('./utils/TestDataSeeder');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("/api/posts/", () => {
  let db;
  let postId0 = mockPosts[0]._id;
  let postId1 = mockPosts[1]._id;
  let postIdNonExistant = mockPosts[0]._id.replace('9', '8');

  const mockAuthenticatedUser = {
    date: '2018-11-11T00:04:19.666Z',
    id: seedProfiles[0].user,
    name: 'test_name',
    email: 'test_email@gmail.com',
    avatar: 'https://angel.co/cdn-cgi/image/width=200,height=200,format=auto,fit=cover/https://d1qb2nb5cznatu.cloudfront.net/users/2094932-original?1563725982',
    password: '$2a$10$JaKVGehh7FK.sqUIlL5QWO.vL2Ux2dvXSHKnPzyDmh1HzFFxYPNpO'
  };

  let passportStub;

  before(done => {
    db = mongoose.connect("mongodb://localhost:27017/test", () => {
      done();
    });
  });

  after(done => {
    mongoose.connection.close(done);
  });

  beforeEach(done => {
    passportStub =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {
      callback(null, mockAuthenticatedUser, null);
      return (req,res,next)=>{};
    });

    addSeedPostsToDb(done);
  });

  afterEach(done => {
    passportStub.restore();
    Post.remove({}, done);
  });

  describe("Posts /", () => {
    describe("GET api/posts/ (getAllPosts)", () => {
      it(`calls endpoint and return 200 status code and all Post records (2 in total)`, (done) => {
          chai.request(app)
            .get('/api/posts')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.length.should.equal(2);
              res.body.should.be.a('array');
              done();
            });
      });
    });

    describe("GET api/posts/:id (getSinglePost)", () => {
      it(`calls endpoint and return 200 status code and a single Post record matching the given id`, (done) => {
          chai.request(app)
            .get(`/api/posts/${postId0}`)
            .end((err, res) => {
              // check id matches id we specified in request
              res.should.have.status(200);
              res.body.should.be.a('object');
              done();
            });
      });
    });
    
    describe("DELETE api/posts/:id (deleteSinglePost)", () => {
      beforeEach(done => {
        let altUser = {...mockAuthenticatedUser, id: seedPosts[1].user };
        passport.authenticate.callsFake((strategy, options, callback) => {
          callback(null, altUser, null);
          return (req,res,next)=>{};
        });
        done();
      });

      it(`calls endpoint and return 200 status code and delete specific Post record for the given id`, (done) => {
        chai.request(app)
          .delete(`/api/posts/${postId1}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });

      it(`calls endpoint and 
          return 401 status code when user tries to delete Post record 
          but they didn't create the Post`, (done) => {
          chai.request(app)
            .delete(`/api/posts/${postId0}`)
            .end((err, res) => {
              const expectedBody = { unauthorised: errorMessages.user_not_authorised };
    
              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(401);
              done();
            });
      });
  
      it(`calls endpoint and return 404 status code
          when user tries to DELETE non-existant Post record`, (done) => {
          chai.request(app)
            .delete(`/api/posts/${postIdNonExistant}`)
            .end((err, res) => {
              const expectedBody = { noPost: errorMessages.post_not_found };
    
              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(404);
              done();
            });
      });
    });

    
    describe("POST api/posts/ (addNewPost)", () => {
      it(`calls endpoint and return 400 status code and 
          'Text field is required' json error when trying to post new post,
          but post text is empty`, (done) => {  
          chai.request(app)
            .post(`/api/posts`)
            .send({})
            .end((err, res) => {
              const expectedBody = { text: errorMessages.text_field_required };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(400);
              done();
            });
      });

      it(`calls endpoint and returns 400 status code and 
          'Post must be between 6 and 300 characters long.' json error
          when user tries to add new post, but post text is < 6 chars`, (done) => {  
          chai.request(app)
            .post(`/api/posts`)
            .send({ text: '12345' })
            .end((err, res) => {
              const expectedBody = { text: errorMessages.post_invalid_length };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(400);
              done();
            });
      });

      it(`calls endpoint and returns 200 status code after adding new Post record 
          when req.body.text is be between 6 and 300 chars`, (done) => {
          const requestBody = { text: '12345678910' };
          chai.request(app)
            .post(`/api/posts`)
            .send(requestBody)
            .end((err, res) => {
              res.body.text.should.equal(requestBody.text);
              res.body.user.should.equal(mockAuthenticatedUser.id);
              res.body.__v.should.equal(0);
              res.should.have.status(200);
              done();
            });
      });
    });


    describe("POST api/posts/likes/:id (addLikeToPost)", () => {
      it(`calls endpoint and return 400 status code and 'likedAlready' json error,
          when user tries to like post they've already liked`, (done) => {
          let altUser = {...mockAuthenticatedUser, id: seedPosts[0].likes[0].user };
          passport.authenticate.callsFake((strategy, options, callback) => {
            callback(null, altUser, null);
            return (req,res,next)=>{};
          });

          chai.request(app)
            .post(`/api/posts/like/${postId0}`)
            .end((err, res) => {
              const expectedBody = { likedAlready: errorMessages.post_already_liked };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(400);
              done();
            });
      });
  
      it(`calls endpoint and return 200 status code 
          after adding a like to the post`, (done) => {
            
          chai.request(app)
            .post(`/api/posts/like/${postId0}`)
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });

      it(`calls endpoint return 404 status code and postNotFound json error
          when trying to add a like to a non-existant post`, (done) => {
          chai.request(app)
            .post(`/api/posts/like/${postIdNonExistant}`)
            .end((err, res) => {
              const expectedBody = { postNotFound: errorMessages.post_not_found };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(404);
              done();
            });
      });
    });

    describe("POST api/posts/unlike/:id (removeLikeFromPost)", () => {
      it(`calls endpoint and returns 200 status code after removing a like from a post`, (done) => {
          let altUser = {...mockAuthenticatedUser, id: seedPosts[0].likes[0].user };
          passport.authenticate.callsFake((strategy, options, callback) => {
            callback(null, altUser, null);
            return (req,res,next)=>{};
          });
          chai.request(app)
            .post(`/api/posts/unlike/${postId0}`)
            .end((err, res) => {
              res.body.likes.length.should.equal(0);
              res.should.have.status(200);
              done();
            });
      });

      it(`calls endpoint and returns 400 status code and 'cannotUnlike' json error,
          when user tries to delete like on post they haven't yet liked`, (done) => {
          chai.request(app)
            .post(`/api/posts/unlike/${postId0}`)
            .end((err, res) => {
              const expectedBody = { cannotUnlike: errorMessages.post_not_yet_liked };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(400);
              done();
            });
      });

      it(`calls endpoint and returns 404 status code and postNotFound json error
          when trying to delete like on a non-existant post`, (done) => {
          chai.request(app)
            .post(`/api/posts/unlike/${postIdNonExistant}`)
            .end((err, res) => {
              const expectedBody = { postNotFound: errorMessages.post_not_found };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(404);
              done();
            });
      });
    });

    describe("POST api/posts/comment/:id (addCommentToPost)", () => {
      it(`calls endpoint and returns 400 status code and 'Text field is required' json eror
          when trying to add comment to post, but comment text is empty`, (done) => {
          chai.request(app)
            .post(`/api/posts/comment/${postId0}`)
            .send({})
            .end((err, res) => {
              const expectedBody = { text: errorMessages.text_field_required };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(400);
              done();
            });
      });

      it(`calls endpoint and returns 400 status code and 
          'Post must be between 6 and 300 characters long.' json error
          when user tries to add comment to post, but comment text is < 6 chars`, (done) => {
          chai.request(app)
          .post(`/api/posts/comment/${postId0}`)
            .send({ text: '12345' })
            .end((err, res) => {
              const expectedBody = { text: errorMessages.post_invalid_length };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(400);
              done();
            });
      });

      it(`calls endpoint and returns 404 status code and Post 'notFound' json error
          when user tries to add comment to non-existant post`, (done) => {
          chai.request(app)
          .post(`/api/posts/comment/${postIdNonExistant}`)
            .send({ text: '12345678910' })
            .end((err, res) => {
              const expectedBody = { notFound: errorMessages.post_not_found };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(404);
              done();
            });
      });

      // NOT PASSING, THINKS POST DOESNT EXIST, DEV ENVIRONMENT NOT WORKING EITHER
      // DEV ENV WORKS AGAIN WHEN YOU RE-ADD THE JWT AUTH REQUIREMENT, SO WE CANNOT PASS THIS TEST UNTIL 
      // WE MOCK OUT THE JWT AUTH
      it(`calls endpoint and returns 200 status code and adds new comment to post
          when req.body.text is be between 6 and 300 chars`, (done) => {
          chai.request(app)
            .post(`/api/posts/comment/${postId0}`)
            .send({ text: '12345678910' })
            .end((err, res) => {
              console.log(res.body);
              const expectedBody = { 
                text: '12345678910',
                name: 'Oisín Foley'
              };

              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(200);
              done();
            });
      });
    });
    describe("DELETE api/comment/:id/:comment_id (deleteCommentFromPost)", () => {
      it(`calls endpoint and returns 404 status code
          when user tries to delete comment from non-existant Post`, (done) => {
          chai.request(app)
            .delete(`/api/posts/comment/${postIdNonExistant}/12345`)
            .end((err, res) => {
              const expectedBody = { notFound: errorMessages.post_not_found };
    
              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(404);
              done();
            });
      });
  
      it(`calls endpoint and returns 404 status code 
          when user tries to delete non-existant comment from a given Post`, (done) => {
          chai.request(app)
            .delete(`/api/posts/comment/${postId0}/12345`)
            .end((err, res) => {
              const expectedBody = { notFound: errorMessages.comment_not_found };
    
              JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
              res.should.have.status(400);
              done();
            });
      });
  
      it(`calls endpoint and returns status code 200 
          and deletes comment matching :comment_id from Post matching :id`, (done) => {
          const commentId = mockPosts[0].comments[0]._id;
          chai.request(app)
            .delete(`/api/posts/${postId0}/${commentId}`)
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });
    });
  });
});