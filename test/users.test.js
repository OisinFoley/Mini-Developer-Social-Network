const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const mongoose = require("mongoose");
const User = require('../src/models/User');
const mockUsers = require('./__mocks__/users');
const errorMessages = require('../src/error-handling/strings');
const { addSeedUsersToDb } = require('./utils/TestDataSeeder');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("/api/users/", () => {
  let db;

  before(done => {
    db = mongoose.connect("mongodb://localhost:27017/test")
    .then(() => addSeedUsersToDb())
    .then(() => done());
  })
  

  after(done => {
    User
      .remove({})
      .then(() => mongoose.connection.close(done));
  });

  describe("Users /", () => {
    describe("POST api/users/register (registerUser)", () => {
      it(`calls endpoint and returns 400 code and 'name length validation' json error
        when doing POST to /register and name is too short`, (done) => {
        let registerData = {...mockUsers[0]};
        registerData.name = 'a';
        chai.request(app)
          .post('/api/users/register')
          .send(registerData)
          .end((err, res) => {
            const expectedBody = { name: errorMessages.name_invalid_length };
            const actualBody = res.body;

            JSON.stringify(expectedBody).should.equal(JSON.stringify(actualBody));
            res.should.have.status(400);
            done();
          });
      });
  

    it(`calls endpoint and returns 400 code and 'name field required' json error
      when and name prop is not provided`, (done) => {
      let registerData = {...mockUsers[0]};
      registerData.name = null;
      chai.request(app)
        .post('/api/users/register')
        .send(registerData)
        .end((err, res) => {
          const expectedBodyName = errorMessages.name_field_required;
          const actualBodyName = res.body.name;

          JSON.stringify(expectedBodyName).should.equal(JSON.stringify(actualBodyName));
          res.should.have.status(400);
          done();
        });
    });
    
    it(`calls endpoint and returns 400 code and 'email is valid' json error
        when email is invalid format`, (done) => {
        let registerData = {...mockUsers[0]};
        registerData.email = 'improperEmail';
        chai.request(app)
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

    it(`calls endpoint and returns 400 code and 'password field must be ...' json error
      when password is < 6 chars`, (done) => {
      let registerData = {...mockUsers[0]};
      registerData.password = 'test';
      chai.request(app)
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

    it(`calls endpoint and returns 400 code 
      and 'password field required and confirm password required' json error
      when password is null and confirmPassword is null`, (done) => {
      let registerData = {...mockUsers[0]};
      registerData.password = null;
      registerData.password2 = null;
      chai.request(app)
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

    it(`calls endpoint and returns 400 code 
      and 'passwords must match error' json error
      when password and confirmPassword do not match`, (done) => {
      let registerData = {...mockUsers[0]};
      registerData.password = 'test';
      registerData.password2 = 'something_else';
      chai.request(app)
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

    it(`calls endpoint and returns 400 code 
      and 'email already taken' json error
      when provided email exists in db`, (done) => {
      let registerData = mockUsers[0];
      chai.request(app)
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

    it(`calls endpoint and returns 200 status code and registers a User 
      when provided email does NOT exists in db`, (done) => {
      let registerData = {...mockUsers[0]};
      registerData.email = 'alternative_test_email@test.com';
      chai.request(app)
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

    describe("POST api/users/login (loginUser)", () => {
      it(`calls endpoint and returns 400 code and 'email is valid' json error
        when email is in invalid format`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.email = 'improperEmail';
        chai.request(app)
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

      it(`should return 400 code and 'email field is required' json error
        when email is null`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.email = null;
        chai.request(app)
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

      it(`calls endpoint and returns 400 code and 'password field required' json error
        when password is null`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.password = null;
        chai.request(app)
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

      it(`calls endpoint and returns 400 status code and 'password does not match' json error
        when password does not match value in db`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.password = 'alternative_test_password';
        chai.request(app)
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

      it(`calls endpoint and returns 404 code and 'user not found' json error
        when email does not exist in db`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.email = 'alternative_test_email2@test.com';
        chai.request(app)
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

      it(`calls endpoint and returns 200 status code and jwt when 
        all values are valid and password matches`, (done) => {
        let loginData = {...mockUsers[0]};
        chai.request(app)
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