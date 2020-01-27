import mongoose from "mongoose";
import sinon from 'sinon';
import passport from 'passport';
import { Request, Response, NextFunction } from "express";

import app from '../src/app';
import User from '../src/models/User';
import mockUsers from './__mocks__/users';
import errorMessages from '../src/utils/error-handling-strings';
import { addSeedUsersToDb } from './data-initialiser/testDataSeeder';
import mockAuthenticatedUser from './__mocks__/authenticated-user';
import BaseTest from './baseTest';
import constants from './constants/strings';

describe("/api/users/", () => {
  const test = new BaseTest('/api/users');
  const { testConnectionString } = constants;

  let passportStub: any;

  before(done => {
    mongoose.connect(testConnectionString, { useNewUrlParser: true }, done);
  })
  after(done => {
    mongoose.connection.close(done);
  });

  beforeEach(done => {
    passportStub =  sinon.stub(passport,"authenticate")
      .callsFake((strategy: any , options: any, callback: any) => {
        callback(null, mockAuthenticatedUser, null);
        return (req: Request, res: Response, next: NextFunction)=>{};
    });

    addSeedUsersToDb(done);
  });
  afterEach(done => {
    passportStub.restore();
    User.deleteMany({}, done);
  });

  describe("Users /", () => {
    describe("POST api/users/register (registerUser)", () => {
      context(`when registering new User and name field is too short or too long (< 2 || > 60)`, () => {
        it(`calls endpoint and returns 400 code and 'name length validation' json error`, (done) => {
          let registerData = {...mockUsers[0]};
          registerData.name = 'a';
          test.chai.request(app)
            .post(`${test.baseRoute}/register`)
            .send(registerData)
            .end((err: Error, res: any) => {
              res.body.name.should.equal(errorMessages.name_invalid_length);
              res.should.have.status(400);
              done();
            });
        });
      });
  
      context(`when registering new User and and name field is null`, () => {
        it(`calls endpoint and returns 400 code and 'name field required' json error`, (done) => {
          let registerData = {...mockUsers[0], name: null };
          test.chai.request(app)
            .post(`${test.baseRoute}/register`)
            .send(registerData)
            .end((err: Error, res: any) => {
              res.body.name.should.equal(errorMessages.name_field_required);
              res.should.have.status(400);
              done();
            });
        });
      });
      
      context(`when registering new User and email is invalid format`, () => {
        it(`calls endpoint and returns 400 code and 'email is valid' json error`, (done) => {
            let registerData = {...mockUsers[0], email: 'improperEmail' };
            test.chai.request(app)
              .post(`${test.baseRoute}/register`)
              .send(registerData)
              .end((err: Error, res: any) => {
                res.body.hasOwnProperty('email').should.equal(true);
                res.body.email.should.equal(errorMessages.invalid_email);
                res.should.have.status(400);
                done();
              });
        });
      });

      context(`when registering new User and password is less than 6 chars`, () => {
        it(`calls endpoint and returns 400 code and 'password field must be ...' json error`, (done) => {
          let registerData = {...mockUsers[0], password: 'test' };
          test.chai.request(app)
            .post(`${test.baseRoute}/register`)
            .send(registerData)
            .end((err: Error, res: any) => {
              res.body.hasOwnProperty('password').should.equal(true);
              res.body.password.should.equal(errorMessages.password_invalid_length);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when registering new User and password and confirmPassword fields are null`, () => {
        it(`calls endpoint and returns 400 code 
          and 'password field required and confirm password required' json error`, (done) => {
          let registerData = {...mockUsers[0], password: null, password2: null };
          test.chai.request(app)
            .post(`${test.baseRoute}/register`)
            .send(registerData)
            .end((err: Error, res: any) => {
              const { password_field_required, confirm_password_field_required } = errorMessages;
              const { password, password2 } = res.body;

              res.body.hasOwnProperty('password').should.equal(true);
              res.body.hasOwnProperty('password2').should.equal(true);
              password.should.equal(password_field_required);
              password2.should.equal(confirm_password_field_required);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when registering new User and password and confrimPassword fields are not equal`, () => {
        it(`calls endpoint and returns 400 code 
          and 'passwords must match error' json error`, (done) => {
          let registerData = {...mockUsers[0], password: 'test', password2: 'something_else'};
          test.chai.request(app)
            .post(`${test.baseRoute}/register`)
            .send(registerData)
            .end((err: Error, res: any) => {
              res.body.hasOwnProperty('password2').should.equal(true);
              res.body.password2.should.equal(errorMessages.passwords_must_match);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when registering new User and email value already exists for a User in the db`, () => {
        it(`calls endpoint and returns 400 code 
          and 'email already taken' json error`, (done) => {
          let registerData = mockUsers[0];
          test.chai.request(app)
            .post(`${test.baseRoute}/register`)
            .send(registerData)
            .end((err: Error, res: any) => {
              res.body.hasOwnProperty('email').should.equal(true);
              res.body.email.should.equal(errorMessages.email_already_taken);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when registering new User and all fields pass validation and User does not exits for the given email in the db`, () => {
        it(`calls endpoint and returns 201 status code and json containing new User`, (done) => {
          const registerData = {...mockUsers[0]};
          registerData.email = 'alternative_test_email@test.com';
          test.chai.request(app)
            .post(`${test.baseRoute}/register`)
            .send(registerData)
            .end((err: Error, res: any) => {
              res.body.hasOwnProperty('name').should.equal(true);
              res.body.hasOwnProperty('email').should.equal(true);
              res.body.hasOwnProperty('password').should.equal(true);
              res.body.hasOwnProperty('avatar').should.equal(true);
              res.should.have.status(201);
              done();
            });
        });
      });
    });

    describe("POST api/users/login (loginUser)", () => {
      context(`when logging in a User and email is in invalid format`, () => {
        it(`calls endpoint and returns 400 code and 'email is valid' json error`, (done) => {
          let loginData = {...mockUsers[0], email: 'improperEmail'};
          test.chai.request(app)
            .post(`${test.baseRoute}/login`)
            .send(loginData)
            .end((err: Error, res: any) => {
              res.body.hasOwnProperty('email').should.equal(true);
              res.body.email.should.equal(errorMessages.invalid_email);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when logging in a User and email is null`, () => {
        it(`should return 400 code and 'email field is required' json error`, (done) => {
          let loginData = {...mockUsers[0], email: null };
          test.chai.request(app)
            .post(`${test.baseRoute}/login`)
            .send(loginData)
            .end((err: Error, res: any) => {
              res.body.hasOwnProperty('email').should.equal(true);
              res.body.email.should.equal(errorMessages.email_field_required);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when logging in a User and password field is null`, () => {
        it(`calls endpoint and returns 400 code and 'password field required' json error`, (done) => {
          let loginData = {...mockUsers[0], password: null };
          test.chai.request(app)
            .post(`${test.baseRoute}/login`)
            .send(loginData)
            .end((err: Error, res: any) => {
              res.body.hasOwnProperty('password').should.equal(true);
              res.body.password.should.equal(errorMessages.password_field_required);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when logging in a User and password does not match value in db`, () => {
        it(`calls endpoint and returns 400 status code and 'password does not match' json error`, (done) => {
          let loginData = {...mockUsers[0], password: 'alternative_test_password'};
          test.chai.request(app)
            .post(`${test.baseRoute}/login`)
            .send(loginData)
            .end((err: Error, res: any) => {
              res.body.hasOwnProperty('password').should.equal(true);
              res.body.password.should.equal(errorMessages.password_not_match);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when logging in a User and email does not exist in the db`, () => {
        it(`calls endpoint and returns 404 code and 'user not found' json error`, (done) => {
          let loginData = {...mockUsers[0], email: 'alternative_test_email2@test.com'};
          test.chai.request(app)
            .post(`${test.baseRoute}/login`)
            .send(loginData)
            .end((err: Error, res: any) => {
              res.body.hasOwnProperty('emailNotFound').should.equal(true);
              res.body.emailNotFound.should.equal(errorMessages.no_user_for_email);
              res.should.have.status(404);
              done();
            });
        });
      });

      context(`when logging in a User and all fields pass validation and password matches value in the db`, () => {
        it(`calls endpoint and returns 200 status code and response has jwt`, (done) => {
          let loginData = {...mockUsers[0]};
          test.chai.request(app)
            .post(`${test.baseRoute}/login`)
            .send(loginData)
            .end((err: Error, res: any) => {
              res.body.success.should.equal(true);
              res.body.hasOwnProperty('token').should.equal(true);
              res.should.have.status(200);
              done();
            });
        });
      });
    });
  });
});