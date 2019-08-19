const chai = require('chai');
const { request } = chai;
const chaiHttp = require('chai-http');
const app = require('../src/app');
const mongoose = require("mongoose");
const User = require('../src/models/User');
const mockUsers = require('./__mocks__/users');
const sinon = require('sinon');
const passport = require('passport');
const errorMessages = require('../src/error-handling/strings');
const { addSeedUsersToDb } = require('./utils/TestDataSeeder');
const mockAuthenticatedUser = require('./__mocks__/authenticated-user');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("/api/users/", () => {
  let db;
  let passportStub;

  before(done => {
    db = mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true }, done);
  })
  after(done => {
    mongoose.connection.close(done);
  });

  beforeEach(done => {
    passportStub =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {
      callback(null, mockAuthenticatedUser, null);
      return (req,res,next)=>{};
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
          request(app)
            .post('/api/users/register')
            .send(registerData)
            .end((err, res) => {
              const expectedBodyNameError = errorMessages.name_invalid_length;

              JSON.stringify(expectedBodyNameError).should.equal(JSON.stringify(res.body.name));
              res.should.have.status(400);
              done();
            });
        });
      });
  
      context(`when registering new User and and name field is null`, () => {
        it(`calls endpoint and returns 400 code and 'name field required' json error`, (done) => {
          let registerData = {...mockUsers[0], name: null };
          request(app)
            .post('/api/users/register')
            .send(registerData)
            .end((err, res) => {
              const expectedBodyNameError = errorMessages.name_field_required;

              JSON.stringify(expectedBodyNameError).should.equal(JSON.stringify(res.body.name));
              res.should.have.status(400);
              done();
            });
        });
      });
      
      context(`when registering new User and email is invalid format`, () => {
        it(`calls endpoint and returns 400 code and 'email is valid' json error`, (done) => {
            let registerData = {...mockUsers[0], email: 'improperEmail' };
            request(app)
              .post('/api/users/register')
              .send(registerData)
              .end((err, res) => {
                const expectedBodyEmail = errorMessages.invalid_email;

                res.body.hasOwnProperty('email').should.equal(true);
                expectedBodyEmail.should.equal(res.body.email);
                res.should.have.status(400);
                done();
              });
        });
      });

      context(`when registering new User and password is less than 6 chars`, () => {
        it(`calls endpoint and returns 400 code and 'password field must be ...' json error`, (done) => {
          let registerData = {...mockUsers[0], password: 'test' };
          request(app)
            .post('/api/users/register')
            .send(registerData)
            .end((err, res) => {
              const expectedBodyPassword = errorMessages.password_invalid_length;

              res.body.hasOwnProperty('password').should.equal(true);
              expectedBodyPassword.should.equal(res.body.password);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when registering new User and password and confirmPassword fields are null`, () => {
        it(`calls endpoint and returns 400 code 
          and 'password field required and confirm password required' json error`, (done) => {
          let registerData = {...mockUsers[0], password: null, password2: null };
          request(app)
            .post('/api/users/register')
            .send(registerData)
            .end((err, res) => {
              const expectedBodyPassword = errorMessages.password_field_required;
              const expectedBodyPassword2 = errorMessages.confirm_password_field_required;            

              res.body.hasOwnProperty('password').should.equal(true);
              res.body.hasOwnProperty('password2').should.equal(true);
              expectedBodyPassword.should.equal(res.body.password);
              expectedBodyPassword2.should.equal(res.body.password2);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when registering new User and password and confrimPassword fields are not equal`, () => {
        it(`calls endpoint and returns 400 code 
          and 'passwords must match error' json error`, (done) => {
          let registerData = {...mockUsers[0], password: 'test', password2: 'something_else'};
          request(app)
            .post('/api/users/register')
            .send(registerData)
            .end((err, res) => {
              const expectedBodyPassword2 = errorMessages.passwords_must_match;

              res.body.hasOwnProperty('password2').should.equal(true);
              expectedBodyPassword2.should.equal(res.body.password2);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when registering new User and email value already exists for a User in the db`, () => {
        it(`calls endpoint and returns 400 code 
          and 'email already taken' json error`, (done) => {
          let registerData = mockUsers[0];
          request(app)
            .post('/api/users/register')
            .send(registerData)
            .end((err, res) => {
              const expectedBodyEmail = errorMessages.email_already_taken;

              res.body.hasOwnProperty('email').should.equal(true);
              expectedBodyEmail.should.equal(res.body.email);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when registering new User and all fields pass validation and User does not exits for the given email in the db`, () => {
        it(`calls endpoint and returns 200 status code and json containing new User`, (done) => {
          let registerData = {...mockUsers[0]};
          registerData.email = 'alternative_test_email@test.com';
          request(app)
            .post('/api/users/register')
            .send(registerData)
            .end((err, res) => {
              // do call to db to verify user exists there
              // later, do a foreach prop in obj, then loop over for so we adhere to DRY

              res.body.hasOwnProperty('name').should.equal(true);
              res.body.hasOwnProperty('email').should.equal(true);
              res.body.hasOwnProperty('password').should.equal(true);
              res.body.hasOwnProperty('avatar').should.equal(true);
              res.should.have.status(200);
              done();
            });
        });
      });
    });

    describe("POST api/users/login (loginUser)", () => {
      context(`when logging in a User and email is in invalid format`, () => {
        it(`calls endpoint and returns 400 code and 'email is valid' json error`, (done) => {
          let loginData = {...mockUsers[0], email: 'improperEmail'};
          request(app)
            .post('/api/users/login')
            .send(loginData)
            .end((err, res) => {
              const expectedBodyEmail = errorMessages.invalid_email;
              
              res.body.hasOwnProperty('email').should.equal(true);
              expectedBodyEmail.should.equal(res.body.email);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when logging in a User and email is null`, () => {
        it(`should return 400 code and 'email field is required' json error`, (done) => {
          let loginData = {...mockUsers[0], email: null };
          request(app)
            .post('/api/users/login')
            .send(loginData)
            .end((err, res) => {
              const expectedBodyEmail = errorMessages.email_field_required;
              
              res.body.hasOwnProperty('email').should.equal(true);
              expectedBodyEmail.should.equal(res.body.email);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when logging in a User and password field is null`, () => {
        it(`calls endpoint and returns 400 code and 'password field required' json error`, (done) => {
          let loginData = {...mockUsers[0], password: null };
          request(app)
            .post('/api/users/login')
            .send(loginData)
            .end((err, res) => {
              const expectedBodyPassword = errorMessages.password_field_required;

              res.body.hasOwnProperty('password').should.equal(true);
              expectedBodyPassword.should.equal(res.body.password);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when logging in a User and password does not match value in db`, () => {
        it(`calls endpoint and returns 400 status code and 'password does not match' json error`, (done) => {
          let loginData = {...mockUsers[0], password: 'alternative_test_password'};
          request(app)
            .post('/api/users/login')
            .send(loginData)
            .end((err, res) => {
              const expectedBodyPassword = errorMessages.password_not_match;

              res.body.hasOwnProperty('password').should.equal(true);
              expectedBodyPassword.should.equal(res.body.password);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when logging in a User and email does not exist in the db`, () => {
        it(`calls endpoint and returns 404 code and 'user not found' json error`, (done) => {
          let loginData = {...mockUsers[0], email: 'alternative_test_email2@test.com'};
          request(app)
            .post('/api/users/login')
            .send(loginData)
            .end((err, res) => {
              const expectedBodyEmail = errorMessages.no_user_for_email;
              
              res.body.hasOwnProperty('email').should.equal(true);
              expectedBodyEmail.should.equal(res.body.email);
              res.should.have.status(404);
              done();
            });
        });
      });

      context(`when logging in a User and all fields pass validation and password matches value in the db`, () => {
        it(`calls endpoint and returns 200 status code and response has jwt`, (done) => {
          let loginData = {...mockUsers[0]};
          request(app)
            .post('/api/users/login')
            .send(loginData)
            .end((err, res) => {
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