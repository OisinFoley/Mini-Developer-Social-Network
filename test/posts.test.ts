import sinon from 'sinon';
import passport from 'passport';
import { Request, Response, NextFunction } from "express";

import app from '../src/app';
import mongoose from "mongoose";
import Post from '../src/models/Post';
import mockPosts from './__mocks__/posts';
import errorMessages from '../src/utils/error-handling-strings';
import { addSeedPostsToDb } from './data-initialiser/testDataSeeder';
import mockAuthenticatedUser from './__mocks__/authenticated-user';
import BaseTest from './baseTest';
import { Like, Comment } from 'devconnector-types/interfaces';
import constants from './constants/strings';

describe("/api/posts/", () => {
  const test = new BaseTest('/api/posts');
  const { testConnectionString } = constants;

  let postId0 = mockPosts[0]._id;
  let postId1 = mockPosts[1]._id;
  let postIdNonExistant = mockPosts[0]._id.replace('9', '8');
  let passportStub: any;

  before(done => {
    mongoose.connect(testConnectionString, { useNewUrlParser: true }, done);
  });
  after(done => {
    mongoose.connection.close(done);
  });

  beforeEach(done => {
    passportStub =
      sinon.stub(passport,"authenticate")
        .callsFake((strategy: any , options: any, callback: any) => {
          callback(null, mockAuthenticatedUser, null);
          return (req: Request, res: Response, next: NextFunction)=>{};
      });

    addSeedPostsToDb(done);
  });
  afterEach(done => {
    passportStub.restore();
    Post.deleteMany({}, done);
  });

  describe("Posts /", () => {
    describe("GET api/posts/ (getAllPosts)", () => {
      context("when fetching Post records and Posts exist in the db", () => {
        it(`calls endpoint and returns 200 status code and an array`, (done) => {
            test.chai.request(app)
              .get(test.baseRoute)
              .end((err: Error, res: any) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
              });
        });
      })
    });

    describe("GET api/posts/:id (getSinglePost)", () => {
      context("when fetching single Post from db and Post matching id param exists in db", () => {
        it(`calls endpoint and returns 200 status code and a single Post record matching the given id`, (done) => {
            test.chai.request(app)
              .get(`${test.baseRoute}/${postId0}`)
              .end((err: Error, res: any) => {
                res.body._id.should.equal(postId0);
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
              });
        });
      });
    });
    
    describe(`DELETE api/posts/:id (deleteSinglePost)`, () => {
      beforeEach(done => {
        let altUser = {...mockAuthenticatedUser, id: mockPosts[1].user };
        passportStub.callsFake((strategy: any, options: any, callback: Function) => {
          callback(null, altUser, null);
          return (req: Request, res: Response, next: NextFunction)=>{};
        });
        done();
      });

      context(`when deleting Post from db and Post matching id param exists in db`, () => {
        it(`calls endpoint and returns 204 status code and deletes specific Post record for the given id`, (done) => {
          test.chai.request(app)
            .delete(`${test.baseRoute}/${postId1}`)
            .end((err: Error, res: any) => {
              res.should.have.status(204);
              done();
            });
        });
      });

      context(`when deleting Post from db and authenticated user didn't create the Post matching the id param in request`, () => {
        it(`calls endpoint and returns 401 status code and 'user not authorised' json error`, (done) => {
            const expectedBody = { unauthorised: errorMessages.user_not_authorised };
            test.chai.request(app)
              .delete(`${test.baseRoute}/${postId0}`)
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(401);
                done();
              });
        });
      });
  
      context(`when deleting Post from db and Post matching id param does not exist in db`, () => {
        it(`calls endpoint and returns 404 status code and 'post not found' json error`, (done) => {
            const expectedBody = { postNotFound: errorMessages.post_not_found };
            test.chai.request(app)
              .delete(`${test.baseRoute}/${postIdNonExistant}`)
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(404);
                done();
              });
        });
      });
    });

    
    describe("POST api/posts/ (addNewPost)", () => {
      context(`when trying to add new Post, but post text is empty`, () => {
        it(`calls endpoint and returns 400 status code and 'Text field is required' json error`, (done) => {  
            const expectedBody = { text: errorMessages.text_field_required };
            test.chai.request(app)
              .post(`${test.baseRoute}`)
              .send({})
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(400);
                done();
              });
        });
      });

      context(`when trying to add new Post, but post text is < 6 chars`, () => {
        it(`calls endpoint and returns 400 status code and 
            'Post must be between 6 and 300 characters long.' json error`, (done) => {  
            const expectedBody = { text: errorMessages.post_invalid_length };
            test.chai.request(app)
              .post(`${test.baseRoute}`)
              .send({ text: '12345' })
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(400);
                done();
              });
        });
      });

      context(`when trying to add new Post and req.body.text is be between 6 and 300 chars`, () => {
        it(`calls endpoint and returns 201 status code after adding new Post record`, (done) => {
            const requestBody = { text: '12345678910' };
            test.chai.request(app)
              .post(`${test.baseRoute}`)
              .send(requestBody)
              .end((err: Error, res: any) => {
                res.body.text.should.equal(requestBody.text);
                res.body.user.should.equal(mockAuthenticatedUser.id);
                res.body.__v.should.equal(0);
                res.should.have.status(201);
                done();
              });
        });
      });
    });


    describe("POST api/posts/:id/likes (addLikeToPost)", () => {
      context(`when user tries to like Post they've already liked`, () => {
        it(`calls endpoint and returns 400 status code and 'likedAlready' json error`, (done) => {
            const altUser = {...mockAuthenticatedUser, id: mockPosts[0].likes[0].user };
            const expectedBody = { likedAlready: errorMessages.post_already_liked };

            passportStub.callsFake((strategy: any, options: any, callback: Function) => {
              callback(null, altUser, null);
              return (req: Request, res: Response, next: NextFunction)=>{};
            });

            test.chai.request(app)
              .post(`${test.baseRoute}/${postId0}/likes`)
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(400);
                done();
              });
        });
      });
  
      context(`when user has not yet like a specified Post`, () => {
        it(`calls endpoint and returns 201 status code 
            after adding a like to the post`, (done) => {
              
            test.chai.request(app)
              .post(`${test.baseRoute}/${postId0}/likes`)
              .end((err: Error, res: any) => {
                res.body.likes[0].user
                  .should.equal(mockAuthenticatedUser.id);
                res.should.have.status(201);
                done();
              });
        });
      });

      context(`when trying to add a like to a Post that does not exist in the db`, () => {
        it(`calls endpoint and returns 404 status code and postNotFound json error`, (done) => {
            const expectedBody = { postNotFound: errorMessages.post_not_found };
            test.chai.request(app)
              .post(`${test.baseRoute}/${postIdNonExistant}/likes`)
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(404);
                done();
              });
        });
      });
    });

    describe("DELTE api/posts/:id/likes (removeLikeFromPost)", () => {
      context(`when user tries to unlike a Post they've previouly 'liked'`, () => {
        it(`calls endpoint while providing the id of the post they've liked, 
            and returns 200 status code after removing the user's like from the post`, (done) => {

            let altUser = {...mockAuthenticatedUser, id: mockPosts[0].likes[0].user };
            passportStub.callsFake((strategy: any, options: any, callback: Function) => {
              callback(null, altUser, null);
              return (req: Request, res: Response, next: NextFunction)=>{};
            });

            test.chai.request(app)
              .delete(`${test.baseRoute}/${postId0}/likes`)
              .end((err: Error, res: any) => {
                res.body.likes.forEach((like: Like) => {
                  like.user.should.not.equal(mockAuthenticatedUser.id);
                });
                res.should.have.status(200);
                done();
              });
        });
      });

      context(`when user tries to delete like on a Post they haven't yet liked`, () => {
        it(`calls endpoint and returns 400 status code and 'cannotUnlike' json error`, (done) => {
            const expectedBody = { cannotUnlike: errorMessages.post_not_yet_liked };
            test.chai.request(app)
            .delete(`${test.baseRoute}/${postId0}/likes`)
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(400);
                done();
              });
        });
      });

      context(`when trying to delete like on a Post that does not exist in the db`, () => {
        it(`calls endpoint and returns 404 status code and postNotFound json error`, (done) => {
            const expectedBody = { postNotFound: errorMessages.post_not_found };
            test.chai.request(app)
              .delete(`${test.baseRoute}/${postIdNonExistant}/likes`)
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(404);
                done();
              });
        });
      });
    });

    describe("POST api/posts/:id/comments (addCommentToPost)", () => {
      context(`when user tries to add comment to Post, but comment text is empty`, () => {
        it(`calls endpoint and returns 400 status code and 'Text field is required' json error`, (done) => {
            const expectedBody = { text: errorMessages.text_field_required };
            test.chai.request(app)
              .post(`${test.baseRoute}/${postId0}/comments`)
              .send({})
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(400);
                done();
              });
        });
      });

      context(`when user tries to add comment to Post, but comment text is < 6 chars`, () => {
        it(`calls endpoint and returns 400 status code and 
            'Post must be between 6 and 300 characters long.' json error`, (done) => {
            const expectedBody = { text: errorMessages.post_invalid_length };
            test.chai.request(app)
            .post(`${test.baseRoute}/${postId0}/comments`)
              .send({ text: '12345' })
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(400);
                done();
              });
        });
      });

      context(`when user tries to add comment to Post that does not exist in the db`, () => {
        it(`calls endpoint and returns 404 status code and postNotFound json error`, (done) => {
            const expectedBody = { postNotFound: errorMessages.post_not_found };
            test.chai.request(app)
            .post(`${test.baseRoute}/${postIdNonExistant}/comments`)
              .send({ text: '12345678910' })
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(404);
                done();
              });
        });
      });

      context(`when user tries to add comment to Post and req.body.text is be between 6 and 300 chars`, () => {
        it(`calls endpoint and returns 201 status code and adds new comment to post`, (done) => {
            const requestBody = { text: '12345678910', name: 'test_name' };
            test.chai.request(app)
              .post(`${test.baseRoute}/${postId0}/comments`)
              .send(requestBody)
              .end((err: Error, res: any) => {
                const newCommentFromPayload = res.body.comments[0];

                newCommentFromPayload.text.should.equal(requestBody.text);
                newCommentFromPayload.name.should.equal(requestBody.name);
                newCommentFromPayload.user.should.equal(mockAuthenticatedUser.id);
                res.should.have.status(201);
                done();
              });
        });
      });
    });

    describe("DELETE api/posts/:postid/comments/:comment_id (deleteCommentFromPost)", () => {
      context(`when user tries to delete comment from Post that does not exist in the db`, () => {
        it(`calls endpoint and returns 404 status code and postNotFound  json error`, (done) => {
            const expectedBody = { postNotFound: errorMessages.post_not_found };
            test.chai.request(app)
              .delete(`${test.baseRoute}/${postIdNonExistant}/comments/12345`)
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(404);
                done();
              });
        });
      });
  
      context(`when user tries to delete comment that does not exist from a given existing Post`, () => {
        it(`calls endpoint and returns 404 status code and commentNotFound json error`, (done) => {
            const expectedBody = { commentNotFound: errorMessages.comment_not_found };
            test.chai.request(app)
              .delete(`${test.baseRoute}/${postId0}/comments/12345`)
              .end((err: Error, res: any) => {
                JSON.stringify(expectedBody).should.equal(JSON.stringify(res.body));
                res.should.have.status(404);
                done();
              });
        });
      });
  
      context(`when trying to delete comment from given Post`, () => {
        it(`calls endpoint and returns status code 200 and json containing the updated Post
            without the deleted comment`, (done) => {
            const commentId = mockPosts[0].comments[0]._id;
            test.chai.request(app)
              .delete(`${test.baseRoute}/${postId0}/comments/${commentId}`)
              .end((err: Error, res: any) => {
                res.body.comments.forEach((comment: Comment) => {
                  comment._id.should.not.equal(commentId);
                });
                res.should.have.status(200);
                done();
              });
        });
      });
    });
  });
});