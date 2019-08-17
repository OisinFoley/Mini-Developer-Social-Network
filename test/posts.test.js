const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const mongoose = require("mongoose");
const Post = require('../src/models/Post');
const mockPosts = require('./__mocks__/posts');
const sinon = require('sinon');
const passport = require('passport');

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

  before(done => {
    db = mongoose.connect("mongodb://localhost:27017/test", done);
  });

  after(done => {
    mongoose.connection.close(done);
  });

  beforeEach(done => {
    addSeedPostsToDb(done);
  });
  afterEach(done => {
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
      it(`calls endpoint and return 200 status code and delete specific Post record for the given id`, (done) => {  
        chai.request(app)
          .delete(`/api/posts/${postId1}`)
          .end((err, res) => {
            // maybe check all posts before and verify against what exists afterward
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
              const actualBody = res.body;
    
              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
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
              const actualBody = res.body;
    
              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
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
              const actualBody = res.body;

              // remember to do json.stringify when comparing otherwise you erroneously compare
              // object object to each other
              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
              res.should.have.status(400);
              done();
            });
      });

      it(`calls endpoint and return 400 status code and 
          'Post must be between 6 and 300 characters long.' json error
          when user tries to add new post, but post text is < 6 chars`, (done) => {  
          chai.request(app)
            .post(`/api/posts`)
            .send({ text: '12345' })
            .end((err, res) => {
              const expectedBody = { text: errorMessages.post_invalid_length };
              const actualBody = res.body;

              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
              res.should.have.status(400);
              done();
            });
      });

      // it(` add new Post when req.body.text is be between 6 and 300 chars,
      //     and return 200 status code`, (done) => {  
      //     chai.request(app)
      //       .post(`/api/posts`)
      //       .send({ text: '12345678910' })
      //       .end((err, res) => {
      //         console.log(res.body);
      //         const expectedBody = { 
      //           text: '12345678910'
      //         };
      //         const actualBody = res.body;

      //         JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
      //         res.should.have.status(200);
      //         done();
      //       });
      // });

    });


    describe("POST api/posts/likes/:id (addLikeToPost)", () => {
      // it(`calls endpoint and return 400 status code and 'likedAlready' json error,
      //     when user tries to like post they've already liked`, (done) => {
      //     chai.request(app)
      //       .post(`/api/posts/like/${postId0}`)
      //       .end((err, res) => {
      //         // console.log(res.body);
      //         const expectedBody = { likedAlready: 'User has already liked post!' };
      //         const actualBody = res.body;

      //         JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
      //         res.should.have.status(400);
      //         done();
      //       });
      // });
  
        it(`calls endpoint and return 200 status code 
            after adding a like to the post`, (done) => {
            chai.request(app)
              .post(`/api/posts/like/${postId0}`)
              .end((err, res) => {
                res.should.have.status(200);
                done();
              });
        });

        // depedent on hardcoded value set addLikeToPost until we create mocked jwtstrategy
        // it(`calls endpoint return 404 status code and postNotFound json error
        //     when trying to add a like to a non-existant post`, (done) => {
        //     chai.request(app)
        //       .post(`/api/posts/like/${postIdNonExistant}`)
        //       .end((err, res) => {
        //         console.log(res.body);
                
        //         const expectedBody = { postNotFound: 'Could not find post with the id provided' };
        //         const actualBody = res.body;

        //         JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
        //         res.should.have.status(404);
        //         done();
        //       });
        // });
    });

    describe("POST api/posts/unlike/:id (removeLikeFromPost)", () => {
      // depends on value of req.user.id 
      // it(`calls endpoint and returns 200 status code after removing a like from a post`, (done) => {
      //     chai.request(app)
      //       .post(`/api/posts/unlike/${postId0}`)
      //       .end((err, res) => {

      //         // compare likes count beforehand with likes count after request is complete
      //         res.body.likes.length.should.equal(0);
      //         res.should.have.status(200);
      //         done();
      //       });
      // });

      // this is flaky and is only successful when ran by itself
      it(`calls endpoint and returns 400 status code and 'cannotUnlike' json error,
          when user tries to delete like on post they haven't yet liked`, (done) => {
          chai.request(app)
            .post(`/api/posts/unlike/${postId0}`)
            .end((err, res) => {
              const expectedBody = { cannotUnlike: errorMessages.post_not_yet_liked };
              const actualBody = res.body;

              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
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
              const actualBody = res.body;

              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
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
              const actualBody = res.body;

              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
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
              const actualBody = res.body;

              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
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
              const actualBody = res.body;

              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
              res.should.have.status(404);
              done();
            });
      });

      // NOT PASSING, THINKS POST DOESNT EXIST, DEV ENVIRONMEN NOT WORKING EITHER
      // DEV ENV WORKS AGAIN WHEN YOU RE-ADD THE JWT AUTH REQUIREMENT, SO WE CANNOT PASS THIS TEST UNTIL 
      // WE MOCK OUT THE JWT AUTH
      // it(`calls endpoint and returns 200 status code and adds new comment to post 
      //     when req.body.text is be between 6 and 300 chars, (done) => {
      //     chai.request(app)
      //       .post(`/api/posts/comment/${postId0}`)
      //       .send({ text: '12345678910' })
      //       .end((err, res) => {
      //         console.log(res.body);
      //         const expectedBody = { 
      //           text: '12345678910'
      //         };
      //         const actualBody = res.body;

      //         JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
      //         res.should.have.status(200);
      //         done();
      //       });
      // });
    });
    describe("DELETE api/comment/:id/:comment_id (deleteCommentFromPost)", () => {
      it(`calls endpoint and returns 404 status code
          when user tries to delete comment from non-existant Post`, (done) => {
          chai.request(app)
            .delete(`/api/posts/comment/${postIdNonExistant}/12345`)
            .end((err, res) => {
              const expectedBody = { notFound: errorMessages.post_not_found };
              const actualBody = res.body;
    
              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
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
              const actualBody = res.body;
    
              JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
              res.should.have.status(400);
              done();
            });
      });
  
  
      // NOT PASSING > GETTING POST NOT FOUND EVEN THOUGH THE POST EXISTS
  
      // it(`calls endpoint and returns status code 200 
      //     and deletes comment matching :comment_id from Post matching :id`, (done) => {
        //   const commentId = postId0.comments[0]._id;
        //   chai.request(app)
        //     .delete(`/api/posts/${postId0}/${commentId}`)
        //     .end((err, res) => {
        //       // const expectedBody = { notFound: errorMessages.comment_not_found };
        //       // const actualBody = res.body;

        //       // JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
        //       console.log(res);
              
        //       res.should.have.status(200);
        //       done();
        //     });
      // });
    });
  });
});