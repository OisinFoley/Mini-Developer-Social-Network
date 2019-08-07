const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require("mongoose");

// const Post = require('../models/Post');
const Profile = require('../models/Profile');
// const mockPosts = require('./__mocks__/posts');
const mockProfiles = require('./__mocks__/profiles');
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

  before(done => {
    db = mongoose.connect("mongodb://localhost:27017/test")
      .then(() => 

      // addSeedProfile()
        mockProfiles.forEach(function(profile) {
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
            res.body.length.should.equal(1);
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
  });
});