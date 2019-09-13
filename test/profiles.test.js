import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import mongoose from "mongoose";
import Profile from '../src/models/Profile';
import sinon from 'sinon';
import passport from 'passport';
import mockProfiles from './__mocks__/profiles';
import errorMessages from '../src/utils/error-handling-strings';
import { addSeedProfilesToDb } from '../test/data-initialiser/testDataSeeder';
import seedProfiles from './__mocks__/seed-profiles';
import mockAuthenticatedUser from './__mocks__/authenticated-user';
import { assignValueToManyObjectProps } from '../src/utils/assignValueToMultipleProps';

const { request } = chai;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("/api/profiles/", () => {
  let db;
  let passportStub;

  before(done => {
    db = mongoose
      .connect("mongodb://localhost:27017/test", {
        useNewUrlParser: true
      }, done);
  });
  after(done => {
    mongoose.connection.close(done);
  });

  beforeEach(done => {
    passportStub =  sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
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
        const profileProps = ['skills', 'date', '_id', 'handle', 'status' , 'social'];
        it(`calls endpoint and returns 200 status and returns a Profile`, (done) => {
          request(app)
            .get('/api/profiles')
            .end((err, res) => {
              profileProps.forEach(prop => {
                res.body.hasOwnProperty(`${prop}`).should.equal(true);  
              });
              
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
                res.body.hasOwnProperty('noProfile').should.equal(true);
                res.body.noProfile.should
                  .equal(errorMessages.profile_not_found_for_current_user);
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
                res.body.hasOwnProperty('noProfile').should.equal(true);
                res.body.noProfile.should
                  .equal(errorMessages.profile_not_found_for_handle);
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
                res.body.hasOwnProperty('noProfile').should.equal(true);
                res.body.noProfile.should
                  .equal(errorMessages.profile_not_found_for_user_id);
                res.should.have.status(404);
                done();
              });
        });
      });

      // TODO: populate user prop so that we can verify that res.body.user matches value 
      // of variable named requestUserIdValue
      context(`when fetching Profile and a Profile exists for the given user_id in the db`, () => {
        it(`calls endpoint and returns 200 status code and profile matching user_id`, (done) => {
          const requestUserIdValue = mockProfiles[1].user;
          request(app)
            .get(`/api/profiles/user/${requestUserIdValue}`)
            .end((err, res) => {
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
              ...mockProfiles[0]
            };
            const propsArray = ['website', 'twitter', 'youtube', 'linkedin', 'instagram', 'facebook'];
            assignValueToManyObjectProps(profileData, propsArray, 'someInvalidUrl');
            
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
                res.body.hasOwnProperty('handle').should.equal(true);
                res.body.handle.should.equal(errorMessages.handle_already_exists);
                res.should.have.status(400);
                done();
              });
        });
      });

      context(`when setting user's Profile and data is valid and authenticated user id matches user prop of an existing profile`, () => {
        it(`calls endpoint and returns 200 code and updated profile as json featuring new 'company' prop value`, (done) => {
          const updatedCompanyString = 'test_company__updated_profile';
          const profileData = {
            ...mockProfiles[0],
            company: updatedCompanyString
          };
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

      context(`when setting user's Profile and data is valid but authenticated user id does not match user prop of an existing profile`, () => {
        it(`calls endpoint and returns 201 code and a new profile as json`, (done) => {
            let altUser = {...mockAuthenticatedUser, id: mockProfiles[0].user.replace('2cb', '123') };
            passport.authenticate.callsFake((strategy, options, callback) => {
              callback(null, altUser, null);
              return (req,res,next)=>{};
            });
            const updatedHandleString = 'test_handle__new_profile';
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
                res.body.__v.should.equal(0);
                res.should.have.status(201);
                done();
              });
        });
      });
    });

    describe("POST api/profiles/experiences (addExperienceToProfile)", () => {
      context(`when adding experience to Profile and title, company, and from date are null in the request`, () => {
        it(`calls endpoint and returns 400 code and 'title, company, from date required validation' json error`, (done) => {
          let experienceData = {
            title: '',
            company: '',
            from: ''
          };
          request(app)
            .post('/api/profiles/experiences')
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
        it(`calls endpoint and returns return 201 code and updated profile json including new experience`, (done) => {
            let newExperienceData = {
              title: 'test_title__new_Experience',
              company: 'test_company__new_Experience',
              from: '2018-05-29T00:00:00.000Z'
            };
            request(app)
              .post('/api/profiles/experiences')
              .send(newExperienceData)
              .end((err, res) => {
                const { user, experience } = res.body;

                user.should.equal(mockAuthenticatedUser.id);
                experience[0].title.should.equal(newExperienceData.title);
                experience[0].company.should.equal(newExperienceData.company);
                experience[0].from.should.equal(newExperienceData.from);
                res.should.have.status(201);
                done();
              });
        });
      });
    });

    describe("DELETE api/profiles/experiences/:exp_id (deleteExperienceFromProfileById)", () => {
      context(`when deleting existing experience from Profile and Profile was created by the authenticated user`, () => {
        it(`calls endpoint and returns 200 code and updated profile json without old experience`, (done) => {
          let { _id } = seedProfiles[0].experience[0];
          request(app)
            .delete(`/api/profiles/experiences/${_id}`)
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

    describe("POST api/profiles/educations (addEducationToProfile)", () => {
      context(`when adding education to Profile and data is valid and authenticated user id matches an existing profile`, () => {
        it(`calls endpoint and returns 201 code 
          and updated profile json including new education`, (done) => {
          let newEducationData = {
            school: 'test_school__new_Education',
            degree: 'test_degree__new_Education',
            fieldOfStudy: 'test_fieldOfStudy__new_Education',
            from: '2018-05-29T00:00:00.000Z'
          };
          request(app)
            .post('/api/profiles/educations')
            .send(newEducationData)
            .end((err, res) => {
              const { user, education } = res.body;

              user.should.equal(mockAuthenticatedUser.id);
              education[0].school.should.equal(newEducationData.school);
              education[0].degree.should.equal(newEducationData.degree);
              education[0].fieldOfStudy.should.equal(newEducationData.fieldOfStudy);
              education[0].from.should.equal(newEducationData.from);
              res.should.have.status(201);
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
              .post('/api/profiles/educations')
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

    describe("DELETE api/profiles/educations/:edu_id (deleteEducationFromProfileById)", () => {
      context(`when deleting existing education from Profile and Profile was created by the authenticated user`, () => {
        it(`calls endpoint and returns 200 code when profile matching user.id does exist`, (done) => {
          let eduId = '5d4c5df704347a3d899893d1';
          request(app)
            .delete(`/api/profiles/educations/${eduId}`)
            .end((err, res) => {
              let { education } = res.body;

              if (education) {
                education.forEach(exp => {
                  exp._id.should.not.equal(eduId);
                });
              }

              res.should.have.status(200);
              done();
            });
        });
      });
    });

    describe("DELETE api/profiles (deleteAccountForUser)", () => {
      context(`when deleting Profile for user from db`, () => {
        it(`calls endpoint and returns 204 code`, (done) => {
          request(app)
            .delete(`/api/profiles/`)
            .end((err, res) => {
              res.should.have.status(204);
              done();
            });
        });
      });
    });
  });
});