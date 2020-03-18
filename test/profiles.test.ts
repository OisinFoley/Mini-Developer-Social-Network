import sinon from 'sinon';
import passport from 'passport';
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import app from '../src/app';
import Profile from '../src/models/Profile';
import { addSeedProfilesToDb } from './data-initialiser/testDataSeeder';
import errorMessages from '../src/utils/error-handling-strings';
import { assignSingleValueToManyObjectProps } from '../src/utils/assignValuesToProps';
import seedProfiles from './__mocks__/seed-profiles';
import mockAuthenticatedUser from './__mocks__/authenticated-user';
import mockProfiles from './__mocks__/profiles';
import BaseTest from './baseTest';
import constants from './constants/strings';
import { Experience, Education } from 'devconnector-types/interfaces';

describe("/api/profiles/", () => {
  const test = new BaseTest('/api/profiles');
  const { testConnectionString } = constants;

  let passportStub: any;
  let non_existant_user_id = '5d7b08333b75e22b68335162';

  before(done => {
    mongoose.connect(testConnectionString, { useNewUrlParser: true }, done);
  });
  after(done => {
    mongoose.connection.close(done);
  });

  beforeEach(done => {
    passportStub = sinon.stub(passport, "authenticate")
      .callsFake((strategy: any , options: any, callback: any) => {
        callback(null, mockAuthenticatedUser, null);
        return (req: Request, res: Response, next: NextFunction)=>{};
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
            test.chai.request(app)
              .get(`${test.baseRoute}`)
              .end((err: Error, res: any) => {
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

            passportStub.callsFake((strategy: any, options: any, callback: Function) => {
              callback(null, altUser, null);
              return (req: Request, res: Response, next: NextFunction)=>{};
            });

            test.chai.request(app)
              .get(`${test.baseRoute}`)
              .end((err: Error, res: any) => {
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
          test.chai.request(app)
            .get(`${test.baseRoute}/all`)
            .end((err: Error, res: any) => {
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
            test.chai.request(app)
              .get(`${test.baseRoute}/handle/${handle}`)
              .end((err: Error, res: any) => {
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
            test.chai.request(app)
              .get(`${test.baseRoute}/handle/${requestHandle}`)
              .end((err: Error, res: any) => {
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
            test.chai.request(app)
              .get(`${test.baseRoute}/user/${non_existant_user_id}`)
              .end((err: Error, res: any) => {
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
          test.chai.request(app)
            .get(`${test.baseRoute}/user/${requestUserIdValue}`)
            .end((err: Error, res: any) => {
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
          test.chai.request(app)
            .post(`${test.baseRoute}`)
            .send(profileData)
            .end((err: Error, res: any) => {
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
            const propsArray: string[] = ['website', 'twitter', 'youtube', 'linkedin', 'instagram', 'facebook'];
            assignSingleValueToManyObjectProps(profileData, propsArray, 'someInvalidUrl');
            
            test.chai.request(app)
              .post(`${test.baseRoute}`)
              .send(profileData)
              .end((err: Error, res: any) => {
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
            passportStub.callsFake((strategy: any, options: any, callback: any) => {
              callback(null, altUser, null);
              return (req: Request, res: Response, next: NextFunction)=>{};
            });

            let profileData = {
              ...mockProfiles[0],
              handle: mockProfiles[1].handle
            };
            
            test.chai.request(app)
              .post(`${test.baseRoute}`)
              .send(profileData)
              .end((err: Error, res: any) => {
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
          test.chai.request(app)
            .post(`${test.baseRoute}`)
            .send(profileData)
            .end((err: Error, res: any) => {
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
            passportStub.callsFake((strategy: any, options: any, callback: Function) => {
              callback(null, altUser, null);
              return (req: Request, res: Response, next: NextFunction)=>{};
            });
            const updatedHandleString = 'test_handle__new_profile';
            let profileData = {
              ...mockProfiles[0],
              handle: updatedHandleString
            };
            test.chai.request(app)
              .post(`${test.baseRoute}`)
              .send(profileData)
              .end((err: Error, res: any) => {
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
          test.chai.request(app)
            .post(`${test.baseRoute}/experiences`)
            .send(experienceData)
            .end((err: Error, res: any) => {
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
            test.chai.request(app)
              .post(`${test.baseRoute}/experiences`)
              .send(newExperienceData)
              .end((err: Error, res: any) => {
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
          let _id = '';
          let [seedProfile] = seedProfiles;
          if (seedProfile.experience) {
            [{ _id }] = seedProfile.experience;
          }
          test.chai.request(app)
            .delete(`${test.baseRoute}/experiences/${_id}`)
            .end((err: Error, res: any) => {
              let { experience } = res.body;

              if (experience) {
                experience.forEach((exp: Experience) => {
                  exp._id.should.not.equal(_id);
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
          test.chai.request(app)
            .post(`${test.baseRoute}/educations`)
            .send(newEducationData)
            .end((err: Error, res: any) => {
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
            test.chai.request(app)
              .post(`${test.baseRoute}/educations`)
              .send(newEducationData)
              .end((err: Error, res: any) => {
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
          test.chai.request(app)
            .delete(`${test.baseRoute}/educations/${eduId}`)
            .end((err: Error, res: any) => {
              let { education } = res.body;

              if (education) {
                education.forEach((edu: Education) => {
                  edu._id?.should.not.equal(eduId);
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
          test.chai.request(app)
            .delete(`${test.baseRoute}/`)
            .end((err: Error, res: any) => {
              res.should.have.status(204);
              done();
            });
        });
      });
    });
  });
});