const chai = require('chai');
const { request } = chai;
const chaiHttp = require('chai-http');
const app = require('../src/app');
const mongoose = require("mongoose");
const Profile = require('../src/models/Profile');
const sinon = require('sinon');
const passport = require('passport');
const mockProfiles = require('./__mocks__/profiles');
const errorMessages = require('../src/error-handling/strings');
const { addSeedProfilesToDb } = require('./utils/TestDataSeeder');
const mockAuthenticatedUser = require('./__mocks__/authenticated-user');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("/api/profiles/", () => {
  let db;
  let passportStub;
   
    /**
     * For the 404 catch errors that are meant to occur when there's a problem in the db(separate from a 404 because
     * the returned data was empty), just close the db connection before running the test, and this should trigger 
     * that particular 404
     * e.g. - .catch(err => res.status(404).json(err)); in getProfileByHandle()
     */

  before(done => {
    db = mongoose
      .connect("mongodb://localhost:27017/test", {
        useNewUrlParser: true, useFindAndModify: false
      }, done);
  });
  after(done => {
    mongoose.connection.close(done);
  });

  beforeEach(done => {
    passportStub =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {
      callback(null, mockAuthenticatedUser, null);
      return (req,res,next)=>{};
    });

    addSeedProfilesToDb(done);
  });
  afterEach(done => {
    passportStub.restore();
    Profile.deleteMany({}, done);
  });

  describe("Profiles /", () => {
    describe("GET api/profiles (getCurrentUsersProfile)", () => {
      context(`when fetching Profile for current user and Profile matching authenticated user exists in the db`, () => {
        it(`calls endpoint and returns 200 status and returns a Profile`, (done) => {
          request(app)
            .get('/api/profiles')
            .end((err, res) => {
              // check that returned payload has user.name and user.avatar

              res.should.have.status(200);
              done();
            });
        });
      });

      context(`when fetching Profile for current user and Profile matching authenticated user does not exist in the db`, () => {
        it(`calls endpoint and returns 404 status code and 'Profile not found' json error`, (done) => {
            let altUser = {...mockAuthenticatedUser, id: mockProfiles[0].user.replace('2cb', '123') };
            passport.authenticate.callsFake((strategy, options, callback) => {
              callback(null, altUser, null);
              return (req,res,next)=>{};
            });

            request(app)
              .get('/api/profiles')
              .end((err, res) => {
                const expectedBodyNoProfile = errorMessages.profile_not_found_for_current_user;
                
                res.body.hasOwnProperty('noProfile').should.equal(true);
                expectedBodyNoProfile.should.equal(res.body.noProfile);
                res.should.have.status(404);
                done();
              });
        });
      });
    });

    describe("GET api/profiles/all (getAllProfiles)", () => {
      context(`when fetching Profile list and Profiles exist in the db`, () => {
        it(`calls endpoint and returns and 200 status code and Profiles list`, (done) => {
          request(app)
            .get('/api/profiles/all')
            .end((err, res) => {
              
              res.body.should.be.a('array');
              res.body.length.should.equal(2);
              res.should.have.status(200);
              done();
            });
        });
      });
    });

    describe("GET api/profiles/handle/:handle (getProfileByHandle)", () => {
      context(`when fetching Profile and no Profile exists for the given handle in the db`, () => {
        it(`calls endpoint and returns 404 status code and 'noProfile' json error`, (done) => {
            const handle = 'non_existant_handle';
            request(app)
              .get(`/api/profiles/handle/${handle}`)
              .end((err, res) => {
                const expectedBodyNoProfile = errorMessages.profile_not_found_for_handle;
                
                res.body.hasOwnProperty('noProfile').should.equal(true);
                expectedBodyNoProfile.should.equal(res.body.noProfile);
                res.should.have.status(404);
                done();
              });
        });
      });

      context(`when fetching Profile and a Profile exists for the given handle in the db`, () => {
        it(`calls endpoint and returns 200 status code and profile matching handle`, (done) => {
            const requestHandle = mockProfiles[0].handle;
            request(app)
              .get(`/api/profiles/handle/${requestHandle}`)
              .end((err, res) => {
                // check that returned payload has user.name and user.avatar
                // .... once you get the jwt authenticate mocked

                res.body.handle.should.equal(requestHandle);
                res.should.have.status(200);
                done();
              });
        });
      });
    });

    describe("GET api/profiles/user/:user_id (getProfileByUserId)", () => {
      context(`when fetching Profile and no Profile exists for the given user_id in the db`, () => {
        it(`calls endpoint and returns 404 status code and 'noProfile' json error`, (done) => {
            const user_id = 'non_existant_user_id';
            request(app)
              .get(`/api/profiles/user/${user_id}`)
              .end((err, res) => {
                const expectedBodyNoProfile = errorMessages.profile_not_found_for_user_id;

                // we have noProfile as a prop in 1 404, and profile as the prop name in the other 404
                // look back on the course videos to see what the implementaion logic was
                
                res.body.hasOwnProperty('profile').should.equal(true);
                expectedBodyNoProfile.should.equal(res.body.profile);
                res.should.have.status(404);
                done();
              });
        });
      });

      context(`when fetching Profile and a Profile exists for the given user_id in the db`, () => {
        it(`calls endpoint and returns 200 status code and profile matching user_id`, (done) => {
          const requestUserIdValue = mockProfiles[1].user;
          request(app)
            .get(`/api/profiles/user/${requestUserIdValue}`)
            .end((err, res) => {
              // check that returned payload has user.name and user.avatar
              // .... once you get the jwt authenticate mocked
              // for this, you may need to also populate users collection in the before hook
              
              res.body.handle.should.equal(mockProfiles[1].handle);
              res.should.have.status(200);
              done();
            });
          });
      });
    });

    describe("POST api/profiles/ (setUserProfile)", () => {
      context(`when setting user's Profile and handle, status and skills are null in the request`, () => {
        it(`calls endpoint and returns 400 code and 'handle, status, skills required validation' json error`, (done) => {
          let profileData = {
            ...mockProfiles[0],
            handle: null,
            status: null,
            skills: null
          };
          request(app)
            .post('/api/profiles')
            .send(profileData)
            .end((err, res) => {
              const { handle, status, skills } = res.body;

              handle.should.equal(errorMessages.handle_required);
              status.should.equal(errorMessages.status_required);
              skills.should.equal(errorMessages.skills_required);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when setting user's Profile and website, youtube, twitter, linkedin, facebook, and instagram are null in the request`, () => {
        it(`calls endpoint and returns 400 status code and
            'not a valid URL for website, youtube, twitter, linkedin, facebook, instagram validation' json error`, (done) => {
            let profileData = {
              ...mockProfiles[0],
              website: 'someInvalidUrl',
              twitter: 'someInvalidUrl',
              youtube: 'someInvalidUrl',
              linkedin: 'someInvalidUrl',
              instagram: 'someInvalidUrl',
              facebook: 'someInvalidUrl'
            };
            
            request(app)
              .post('/api/profiles')
              .send(profileData)
              .end((err, res) => {
                const { website, twitter, facebook, youtube, instagram, linkedin } = res.body;
                const NotValidUrlString = errorMessages.invalid_url;

                website.should.equal(NotValidUrlString);
                twitter.should.equal(NotValidUrlString);
                facebook.should.equal(NotValidUrlString);
                youtube.should.equal(NotValidUrlString);
                instagram.should.equal(NotValidUrlString);
                linkedin.should.equal(NotValidUrlString);
                res.should.have.status(400);
                done();
              });
        });
      });

      context(`when setting user's Profile and the handle in the request body is already used by another user`, () => {
        it(`calls endpoint and returns 400 status code and 'handle already exists' json error`, (done) => {
            let altUser = {...mockAuthenticatedUser, id: mockProfiles[0].user.replace('2cb', '123') };
            passport.authenticate.callsFake((strategy, options, callback) => {
              callback(null, altUser, null);
              return (req,res,next)=>{};
            });

            let profileData = {
              ...mockProfiles[0],
              handle: mockProfiles[1].handle
            };
            
            request(app)
              .post('/api/profiles')
              .send(profileData)
              .end((err, res) => {
                const expectedBodyHandle = errorMessages.handle_already_exists;
                
                res.body.hasOwnProperty('handle').should.equal(true);
                expectedBodyHandle.should.equal(res.body.handle);
                res.should.have.status(400);
                done();
              });
        });
      });
  
      context(`when setting user's Profile and data is valid and authenticated user id matches user prop of an existing profile`, () => {
        it(`calls endpoint and returns 200 code and updated profile as json`, (done) => {
          const updatedCompanyString = 'test_company_for_updated_profile';
          let profileData = {
            ...mockProfiles[0],
            company: updatedCompanyString
          };
          // TODO: Use for([key,value] of) to check that the values of the res.body props
          // matches the payload sent in the request
          request(app)
            .post('/api/profiles')
            .send(profileData)
            .end((err, res) => {
              res.body.hasOwnProperty('company').should.equal(true);
              res.body.company.should.equal(updatedCompanyString);
              res.should.have.status(200);
              done();
            });
        });
      });

      context(`when setting user's Profile and data is valid and authenticated user id does not match user prop of an existing profile`, () => {
        it(`calls endpoint and returns 200 code and new profile as json`, (done) => {
            const updatedHandleString = 'test_handle_new_profile';
            let profileData = {
              ...mockProfiles[0],
              handle: updatedHandleString
            };
            request(app)
              .post('/api/profiles')
              .send(profileData)
              .end((err, res) => {
                res.body.hasOwnProperty('handle').should.equal(true);
                res.body.handle.should.equal(updatedHandleString);
                res.should.have.status(200);
                done();
              });
        });
      });
    });
    

    describe("POST api/profiles/experience (addNewExperience)", () => {
      context(`when adding experience to Profile and title, company, and from date are null in the request`, () => {
        it(`calls endpoint and returns 400 code and 'title, company, from date required validation' json error`, (done) => {
          let experienceData = {
            title: '',
            company: '',
            from: ''
          };
          request(app)
            .post('/api/profiles/experience')
            .send(experienceData)
            .end((err, res) => {
              const { title, company, from } = res.body;

              title.should.equal(errorMessages.title_field_required);
              company.should.equal(errorMessages.company_field_required);
              from.should.equal(errorMessages.from_date_field_required);
              res.should.have.status(400);
              done();
            });
        });
      });

      context(`when adding experience to Profile and data is valid and authenticated user id matches an existing profile`, () => {
        it(`calls endpoint and returns return 200 code and updated profile json including new experience`, (done) => {
            let newExperienceData = {
              title: 'test_title_new_Experience',
              company: 'test_company_new_Experience',
              from: '2018-05-29T00:00:00.000Z'
            };
            request(app)
              .post('/api/profiles/experience')
              .send(newExperienceData)
              .end((err, res) => {
                const { title, company, from } = res.body;
                
                // assert that res.body has the keys of the mock profiles
                // and assert that updated profile exp matches the 'newExperienceData' values

                res.should.have.status(200);
                done();
              });
        });
      });
    });

    describe("DELETE api/profiles/experience/:exp_id (deleteExperienceById)", () => {
      context(`when deleting existing experience from Profile and Profile was created by the authenticated user`, () => {
        it(`calls endpoint and returns 200 code and updated profile json without old experience`, (done) => {
          let expId = '5d4c5dec5b62789cbc86d014';
          request(app)
            .delete(`/api/profiles/experience/${expId}`)
            .end((err, res) => {
              let { experience } = res.body;

              if (experience) {
                experience.forEach(exp => {
                  exp._id.should.not.equal(expId);
                });
              }

              res.should.have.status(200);
              done();
            });
        });
      });
    });

    describe("POST api/profiles/education (addEducation)", () => {
      context(`when adding education to Profile and data is valid and authenticated user id matches an existing profile`, () => {
        it(`calls endpoint and returns 200 code 
          and updated profile json including new education`, (done) => {
          let newEducationData = {
            school: 'test_school_new_Education',
            degree: 'test_degree_new_Education',
            fieldOfStudy: 'test_fieldOfStudy_new_Education',
            from: '2018-05-29T00:00:00.000Z'
          };
          request(app)
            .post('/api/profiles/education')
            .send(newEducationData)
            .end((err, res) => {
              const { school, degree, fieldOfStudy, from } = res.body;
              
              // assert that res.body has the keys of the mock profiles
              // and assert that updated profile exp matches the 'newEducationData' values

              res.should.have.status(200);
              done();
            });
        });
      });

      context(`when adding education to Profile and school, degree, fieldOfStudy and from date are null in the request`, () => {
        it(`calls endpoint and returns 400 code and 
            'school, degree, fieldOfStudy and from date required validation' json error`, (done) => {
            let newEducationData = {
              school: '',
              degree: '',
              fieldOfStudy: '',
              from: ''
            };
            request(app)
              .post('/api/profiles/education')
              .send(newEducationData)
              .end((err, res) => {
                const { school, degree, fieldOfStudy, from } = res.body;

                school.should.equal(errorMessages.school_field_required);
                degree.should.equal(errorMessages.degree_field_required);
                fieldOfStudy.should.equal(errorMessages.fieldOfStudy_field_required);
                from.should.equal(errorMessages.from_date_field_required);
                res.should.have.status(400);
                done();
              });
        });
      });
    });

    describe("DELETE api/profiles/education/:edu_id (deleteEducation)", () => {
      context(`when deleting existing education from Profile and Profile was created by the authenticated user`, () => {
        it(`calls endpoint and returns 200 code when profile matching user.id does exist`, (done) => {
          let eduId = '5d4c5df704347a3d899893d1';
          request(app)
            .delete(`/api/profiles/education/${eduId}`)
            .end((err, res) => {   
              res.should.have.status(200);
              done();
            });
        });
      });
    });

    describe("DELETE api/profiles (deleteAccountForUser)", () => {
      context(`when deleting all Profiles from db`, () => {
        it(`calls endpoint and returns 200 code and { success: true }`, (done) => {
          request(app)
            .delete(`/api/profiles/`)
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
      });
    });
  });
});