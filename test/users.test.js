const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require("mongoose");

const User = require('../models/User');
const mockUsers = require('./__mocks__/users');
const mockSeedUser = require('./__mocks__/seed-user');
const sinon = require('sinon');
const passport = require('passport');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("/api/users/", () => {
  let db;

  before(done => {
    db = mongoose.connect("mongodb://localhost:27017/test")
    .then(() =>  {    
      let newUser = new User({
        name: mockSeedUser.name,
        email: mockSeedUser.email,
        password: mockSeedUser.password,
        avatar: mockSeedUser.avatar
      });
      newUser.save();
    })
    .then(() => done());
  })
  

  after(done => {
    User
      .remove({})
      .then(() => mongoose.connection.close(done));
  });

  describe("Users /", () => {
    it(`should return 400 code and 'name length validation error' json when doing POST to /register 
        and name is too short`, (done) => {
        let registerData = {...mockUsers[0]};
        registerData.name = 'a';
        chai.request(app)
          .post('/api/users/register')
          .send(registerData)
          .end((err, res) => {
            const expectedBody = { name: 'Name must be between 2 and 30 characters long' };
            const actualBody = res.body;

            expectedBody.toString().should.equal(actualBody.toString());
            res.should.have.status(400);
            done();
          });
        });
    

    it(`should return 400 code and 'name field required error' json 
        when doing POST to /register 
        and name prop is not provided`, (done) => {
        let registerData = {...mockUsers[0]};
        registerData.name = null;
        chai.request(app)
          .post('/api/users/register')
          .send(registerData)
          .end((err, res) => {
            // const expectedBody = { name: 'Name field is required' };
            const expectedBodyName = 'Name field is required';
            const actualBodyName = res.body.name;

            expectedBodyName.toString().should.equal(actualBodyName.toString());
            res.should.have.status(400);
            done();
          });
        });
      
    it(`should return 400 code and 'email is valid error' json 
        when doing POST to /register 
        and email is invalid format`, (done) => {
        let registerData = {...mockUsers[0]};
        registerData.email = 'improperEmail';
        chai.request(app)
          .post('/api/users/register')
          .send(registerData)
          .end((err, res) => {
            // const expectedBodyEmail = { email: 'Email is invalid' };
            const expectedBodyEmail = 'Email is invalid';
            // const actualBodyEmail = res.body.email;

            // console.log(JSON.stringify(expectedBodyEmail));
            // console.log(JSON.stringify(actualBodyEmail));

            // WE NEED TO GO BACK OVER ALL TESTS AND STRINGIFY THE RESPONSE
            // OTHERWISE WE'RE JUST COMPARING OBJECT OBJECT TO EACH OTHER

            
            
            res.body.hasOwnProperty('email').should.equal(true);
            expectedBodyEmail.should.equal(res.body.email);
            res.should.have.status(400);
            done();
          });
        });

    it(`should return 400 code and 'password field must be error' json 
        when doing POST to /register 
        and password is < 6 chars`, (done) => {
        let registerData = {...mockUsers[0]};
        registerData.password = 'test';
        chai.request(app)
          .post('/api/users/register')
          .send(registerData)
          .end((err, res) => {
            const expectedBodyPassword = 'Password must be between 6 and 30 characters long';

            res.body.hasOwnProperty('password').should.equal(true);
            expectedBodyPassword.should.equal(res.body.password);
            res.should.have.status(400);
            done();
          });
        });

    it(`should return 400 code 
        and have 'password field required and confirm password required error' json 
        when doing POST to /register 
        and password is null and confirmPassword is null`, (done) => {
        let registerData = {...mockUsers[0]};
        registerData.password = null;
        registerData.password2 = null;
        chai.request(app)
          .post('/api/users/register')
          .send(registerData)
          .end((err, res) => {
            const expectedBodyPassword = 'Password field is required';
            const expectedBodyPassword2 = 'Confirm Password field is required';            

            res.body.hasOwnProperty('password').should.equal(true);
            res.body.hasOwnProperty('password2').should.equal(true);
            expectedBodyPassword.should.equal(res.body.password);
            expectedBodyPassword2.should.equal(res.body.password2);
            res.should.have.status(400);
            done();
          });
        });

    it(`should return 400 code 
        and have 'passwords must match error' json 
        when doing POST to /register 
        and password and confirmPassword do not match`, (done) => {
        let registerData = {...mockUsers[0]};
        registerData.password = 'test';
        registerData.password2 = 'something_else';
        chai.request(app)
          .post('/api/users/register')
          .send(registerData)
          .end((err, res) => {
            const expectedBodyPassword2 = 'Passwords must be a match';

            res.body.hasOwnProperty('password2').should.equal(true);
            expectedBodyPassword2.should.equal(res.body.password2);
            res.should.have.status(400);
            done();
          });
        });

    it(`should return 400 code 
        and have 'email already taken' json 
        when doing POST to /register 
        and provided email exists in db`, (done) => {
        let registerData = mockUsers[0];
        chai.request(app)
          .post('/api/users/register')
          .send(registerData)
          .end((err, res) => {
            const expectedBodyEmail = 'Email already taken';

            res.body.hasOwnProperty('email').should.equal(true);
            expectedBodyEmail.should.equal(res.body.email);
            res.should.have.status(400);
            done();
          });
        });

    it(`should register a User when doing a POST to /register 
        and provided email does NOT exists in db`, (done) => {
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



        // login 


    it(`should return 400 code and 'email is valid error' json 
        when doing POST to /login 
        and email is invalid format`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.email = 'improperEmail';
        chai.request(app)
          .post('/api/users/login')
          .send(loginData)
          .end((err, res) => {
            // const expectedBodyEmail = { email: 'Email is invalid' };
            const expectedBodyEmail = 'Email is invalid';
            // const actualBodyEmail = res.body.email;
            
            
            res.body.hasOwnProperty('email').should.equal(true);
            expectedBodyEmail.should.equal(res.body.email);
            res.should.have.status(400);
            done();
          });
        });

    it(`should return 400 code and 'email field is required error' json 
        when doing POST to /login 
        and email is null`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.email = null;
        chai.request(app)
          .post('/api/users/login')
          .send(loginData)
          .end((err, res) => {
            // const expectedBodyEmail = { email: 'Email is invalid' };
            const expectedBodyEmail = 'Email field is required';
            // const actualBodyEmail = res.body.email;
            
            
            res.body.hasOwnProperty('email').should.equal(true);
            expectedBodyEmail.should.equal(res.body.email);
            res.should.have.status(400);
            done();
          });
        });

    it(`should return 400 code and 'password field required error' json 
        when doing POST to /login 
        and password is null`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.password = null;
        chai.request(app)
          .post('/api/users/login')
          .send(loginData)
          .end((err, res) => {
            const expectedBodyPassword = 'Password field is required';

            res.body.hasOwnProperty('password').should.equal(true);
            expectedBodyPassword.should.equal(res.body.password);
            res.should.have.status(400);
            done();
          });
        });

    it(`should return 400 code and 'password does not match error' json 
        when doing POST to /login 
        and password does not match value in db`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.password = 'alternative_test_password';
        chai.request(app)
          .post('/api/users/login')
          .send(loginData)
          .end((err, res) => {
            const expectedBodyPassword = 'Password does not match';

            res.body.hasOwnProperty('password').should.equal(true);
            expectedBodyPassword.should.equal(res.body.password);
            res.should.have.status(400);
            done();
          });
        });

    it(`should return 404 code and 'user not found error' json 
        when doing POST to /login 
        and email does not exist in db`, (done) => {
        let loginData = {...mockUsers[0]};
        loginData.email = 'alternative_test_email2@test.com';
        chai.request(app)
          .post('/api/users/login')
          .send(loginData)
          .end((err, res) => {
            const expectedBodyEmail = 'User does not exist';
            
            res.body.hasOwnProperty('email').should.equal(true);
            expectedBodyEmail.should.equal(res.body.email);
            res.should.have.status(404);
            done();
          });
        });

    it(`should return login and return jwt when 
        when doing POST to /login 
        and all values are valid and password matches`, (done) => {
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