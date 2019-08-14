const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require("mongoose");

// const Post = require('../models/Post');
const Profile = require('../models/Profile');
// const mockPosts = require('./__mocks__/posts');
const mockProfiles = require('./__mocks__/profiles');
const mockSeedProfiles = require('./__mocks__/seed-profiles');
const sinon = require('sinon');
const passport = require('passport');

// Configure chai
chai.use(chaiHttp);
chai.should();

// addSeedProfile = () => {
//   mockProfiles.forEach(function(profile) {
//     const newProfile = new Profile({
//       _id: profile._id,
//       skills: profile.skills,
//       date: profile.date,
//       user: profile.user,
//       handle: profile.handle,
//       company: profile.company,
//       website: profile.website,
//       location: profile.location,
//       status: profile.status,
//       social: profile.social,
//       experience: profile.experience,
//       education: profile.education,
//       bio: profile.bio
//     });
//     newProfile.save();
//   });
// };

// removeAllProfiles = () => {
//   // maybe this should resolve a promise in order to ensure correct flow ??
//   Profile.remove({});
// };

describe("/api/profile/", () => {
  let db;

  /**
   *  fix all mentionings of this api route in appjs and filenames
   *  so that it is written as /profile*s*, instea dof singular
   *  , then it'll match with the other entities and adheres to REST naming of endpoints
   * 
   */


   /**
    * later, put a describe block for each actual api function you're testing, 
    * so that it's well formatted when the results are outputted to the console window
    * e.g. - outer describe of '/api/profile/'
    * and inner describe block of 'getCurrentUsersProfile'
    *  then we have 3 or 4 tests inside each, to test the different status codes
    * 
    */
   
    /**
     * For the 404 catch errors that are meant to occur when there's a problem in the db(separate from a 404 because
     * the returned data was empty), just close the db connection before running the test, and this should trigger 
     * that particular 404
     * e.g. - .catch(err => res.status(404).json(err)); in getProfileByHandle()
     */

     /**
      * make language description of each test consistent 
      * notice how the 404 and 400s are different from the 200
      */

  before(done => {
    db = mongoose.connect("mongodb://localhost:27017/test")
      .then(() => 

      // addSeedProfile()
      mockSeedProfiles.forEach(function(profile) {
          const newProfile = new Profile({
            _id: profile._id,
            skills: profile.skills,
            date: profile.date,
            user: profile.user,
            handle: profile.handle,
            company: profile.company,
            website: profile.website,
            location: profile.location,
            status: profile.status,
            social: profile.social,
            experience: profile.experience,
            education: profile.education,
            bio: profile.bio
          });
          newProfile.save();
        })
    )
    .then(() => done());
  });

  after(done => {
    // removeAllProfiles()
    Profile
      .remove({})
      .then(() => mongoose.connection.close(done));
  });

  describe("Profiles /", () => {
    // it(`should do GET request to / 
    //     and return profile and 200 status code`, (done) => {
    //     chai.request(app)
    //       .get('/api/profile')
    //       .end((err, res) => {
    //         // check that returned payload has user.name and user.avatar
    //         // .... once you get the jwt authenticate mocked
            
    //         res.should.have.status(200);
    //         done();
    //       });
    //     });

    it(`should return 404 status code and 'Profile not found error' json
        when doing GET request to / 
        and no profile exists that matches user.id`, (done) => {
        chai.request(app)
          .get('/api/profile')
          .end((err, res) => {
            const expectedBodyNoProfile = 'Profile not found';
            
            res.body.hasOwnProperty('noProfile').should.equal(true);
            expectedBodyNoProfile.should.equal(res.body.noProfile);
            res.should.have.status(404);
            done();
          });
        });

    it(`should do GET request to /all
        and return profiles list and 200 status code`, (done) => {
        chai.request(app)
          .get('/api/profile/all')
          .end((err, res) => {
            // console.log(res.body);
            
            res.body.should.be.a('array');
            res.body.length.should.equal(2);
            res.should.have.status(200);
            done();
          });
        });


    // this one needs a bit of work -> need to gracefully empty the db at start, the re-populate it at end of test
    // it(`should do GET request to /all
    //     and return 404 status code when no profiles are returned from db`, (done) => {
          
    //     chai.request(app)
    //       .get('/api/profile/all')
    //       .end((err, res) => {

    //         // removeAllProfiles()
    //         //   .then(() => {
    //         //     const expectedBodyProfile = 'There are no profiles.';
            
    //         //     res.body.hasOwnProperty('profile').should.equal(true);
    //         //     expectedBodyProfile.should.equal(res.body.profile);
    //         //     res.should.have.status(404);

    //         //     addSeedProfile();
    //         //   });
    //         //   done();


            
    //         done();
    //       });
    //     });


    //  handle tests

    it(`should return 404 status code and 'noProfile error' json
        when doing GET request to /handle/:handle
        and no profile exists for the given handle`, (done) => {
        const handle = 'non_existant_handle';
        chai.request(app)
          .get(`/api/profile/handle/${handle}`)
          .end((err, res) => {
            const expectedBodyNoProfile = 'There is no profile for the given handle.';
            
            res.body.hasOwnProperty('noProfile').should.equal(true);
            expectedBodyNoProfile.should.equal(res.body.noProfile);
            res.should.have.status(404);
            done();
          });
        });

    it(`should do GET request to /handle/:handle, then return profile matching handle and 200 status code`, (done) => {
        const requestHandle = mockProfiles[0].handle;
        chai.request(app)
          .get(`/api/profile/handle/${requestHandle}`)
          .end((err, res) => {
            // check that returned payload has user.name and user.avatar
            // .... once you get the jwt authenticate mocked

            res.body.handle.should.equal(requestHandle);
            res.should.have.status(200);
            done();
          });
        });

    // get profile by id

    it(`should return 404 status code and 'noProfile error' json
        when doing GET request to /user/:user_id
        and no profile exists for the given user_id`, (done) => {
        const user_id = 'non_existant_user_id';
        chai.request(app)
          .get(`/api/profile/user/${user_id}`)
          .end((err, res) => {
            const expectedBodyNoProfile = 'No profile for this user id.';

            // we have noProfile as a prop in 1 404, and profile as the prop name in the other 404
            // look back on the course videos to see what the implementaion logic was
            
            res.body.hasOwnProperty('profile').should.equal(true);
            expectedBodyNoProfile.should.equal(res.body.profile);
            res.should.have.status(404);
            done();
          });
        });

    // cannot pass test until we can mock jwt auth and check the value of user in res.body (which is populated)
    // by the 'populate' call in the api that user the user part of the request body (which comes from jwt earlier
    // in the request pipeline)
    // it(`should do GET request to /user/:user_id, then return profile matching user_id and 200 status code`, (done) => {
    //     const requestUserIdValue = mockProfiles[0].user;
    //     chai.request(app)
    //       .get(`/api/profile/user/${requestUserIdValue}`)
    //       .end((err, res) => {
    //         // check that returned payload has user.name and user.avatar
    //         // .... once you get the jwt authenticate mocked

    //         console.log(res.body);
            

    //         res.body.handle.should.equal(requestUserIdValue);
    //         res.should.have.status(200);
    //         done();
    //       });
    //     });

    it(`should return 400 code and 'handle, status, skills required validation error' json
        when doing POST to / and handle, status and skills are null in the request`, (done) => {
        let profileData = {
          ...mockProfiles[0],
          handle: null,
          status: null,
          skills: null
        };
        chai.request(app)
          .post('/api/profile')
          .send(profileData)
          .end((err, res) => {
            const { handle, status, skills } = res.body;
            const expectedBodyHandle = 'Profile handle is required';
            const expectedBodyStatus = 'Profile status is required';
            const expectedBodySkills = 'Profile skills is required';

            handle.should.equal(expectedBodyHandle);
            status.should.equal(expectedBodyStatus);
            skills.should.equal(expectedBodySkills);
            res.should.have.status(400);
            done();
          });
        });

    it(`should return 400 code and 
        'not a valid URL for website, youtube, twitter, linkedin, facebook, instagram validation error' json
        when doing POST to / and each of those values are null in the request`, (done) => {
        let profileData = {
          ...mockProfiles[0],
          website: 'someInvalidUrl',
          twitter: 'someInvalidUrl',
          youtube: 'someInvalidUrl',
          linkedin: 'someInvalidUrl',
          instagram: 'someInvalidUrl',
          facebook: 'someInvalidUrl'
        };
        
        chai.request(app)
          .post('/api/profile')
          .send(profileData)
          .end((err, res) => {
            const { website, twitter, facebook, youtube, instagram, linkedin } = res.body;
            const NotValidUrlString = 'Not a valid URL';

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

    it(`should return 400 code and 'handle already exists error' json
        when doing POST to / and user does not have a profile,
        and chosen handle already exists`, (done) => {
        let profileData = {
          ...mockProfiles[0],
          handle: mockSeedProfiles[1].handle
        };
        
        chai.request(app)
          .post('/api/profile')
          .send(profileData)
          .end((err, res) => {
            const { handle } = res.body;
            const expectedBodyHandle = 'This handle already exists';
            
            res.body.hasOwnProperty('handle').should.equal(true);
            expectedBodyHandle.should.equal(res.body.handle);
            res.should.have.status(400);
            done();
          });
        });

    // this passes and dpeends on user.id set in test (UNTIL WE CAN MOCK JWT.AUTHENTICATE)
    // will fail unless ran as it.only because we haven't cleaned up the result of other running tests yet
    // it.only(`should POST to / and return 200 code and updated profile
    //     when data is valid and request user id matches user prop of existing profile`, (done) => {
    //     const updatedCompanyString = 'test_company_for_updated_profile';
    //     let profileData = {
    //       ...mockProfiles[0],
    //       company: updatedCompanyString
    //     };
    //     chai.request(app)
    //       .post('/api/profile')
    //       .send(profileData)
    //       .end((err, res) => {
    //         const { company } = res.body;
    //         // console.log(res.body.company);
    //         // console.log(res);

    //         // for (let key in res.body) {
    //         for (let [key, value] of Object.entries(res.body)) {
    //           // console.log(`${key} and ${value}`);

    //           if (key === 'company') {
    //             value.should.equal(updatedCompanyString);
    //             continue;
    //           }

    //           // this is incomplete because we are sometimes comparing a non existant key in the mock data
    //           // to a key that does exists in the res.body

    //           // also, we're comparing a string of separate skills in the mockprofile
    //           // to an array of skills in the res.body
    //           // tidy and finalise later
    //           console.log(mockProfiles[0][key]);
    //           console.log(res.body[key]);

    //           if (mockProfiles[0][key]) {
    //             mockProfiles[0][key].should.equal(res.body[key]);   
    //           }
    //           // mockProfiles[0][key].should.equal(res.body[key]); 
    //         }
    //         // compare all keys, but if key is company, then company should equal updated value

    //         res.body.hasOwnProperty('company').should.equal(true);
    //         res.body.company.should.equal(updatedCompanyString);
    //         res.should.have.status(200);
    //         done();
    //       });
    //     });


    // it.only(`should POST to / and return 200 code and new profile
    //     when data is valid and request user id does not match user
    //     prop of an existing profile`, (done) => {
    //     const updatedHandleString = 'test_handle_new_profile';
    //     let profileData = {
    //       ...mockProfiles[0],
    //       handle: updatedHandleString
    //     };
    //     chai.request(app)
    //       .post('/api/profile')
    //       .send(profileData)
    //       .end((err, res) => {
    //         // const { company } = res.body;
            
    //         // // compare all keys, but if key is company, then company should equal updated value

    //         res.body.hasOwnProperty('handle').should.equal(true);
    //         res.body.handle.should.equal(updatedHandleString);
    //         res.should.have.status(200);
    //         done();
    //       });
    //     });

    // experience tests 

    it(`should return 400 code and 
        'title, company, from date required validation error' json
        when doing POST to /experience and each of those values are null in the request`, (done) => {
        let experienceData = {
          title: '',
          company: '',
          from: ''
        };
        chai.request(app)
          .post('/api/profile/experience')
          .send(experienceData)
          .end((err, res) => {
            const { title, company, from } = res.body;
            const titleRequiredString = 'Title field is required';
            const companyRequiredString = 'Company field is required';
            const fromDateRequiredString = 'From date field is required';

            title.should.equal(titleRequiredString);
            company.should.equal(companyRequiredString);
            from.should.equal(fromDateRequiredString);
            res.should.have.status(400);
            done();
          });
        });

    it(`should POST to /experience and return 200 code 
        and updated profile json including new experience 
        when doing POST to /experience and data is valid and user.id 
        matches an existing profile`, (done) => {
        let newExperienceData = {
          title: 'test_title_new_Experience',
          company: 'test_company_new_Experience',
          from: '2018-05-29T00:00:00.000Z'
        };
        chai.request(app)
          .post('/api/profile/experience')
          .send(newExperienceData)
          .end((err, res) => {
            const { title, company, from } = res.body;
            console.log(res.body);
            
            
            // assert that res.body has the keys of the mock profiles
            // and assert that updated profile exp matches the 'newExperienceData' values

            res.should.have.status(200);
            done();
          });
        });

    it(`should DELETE to /experience/:exp_id and return 200 code 
        and updated profile json without old experience 
        when exp_id matches existing experience for given user.id`, (done) => {
        let expId = '5d4c5dec5b62789cbc86d014';
        chai.request(app)
          .delete(`/api/profile/experience/${expId}`)
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