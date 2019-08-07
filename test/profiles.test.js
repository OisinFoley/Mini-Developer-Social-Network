// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../app');
// const mongoose = require("mongoose");

// const Post = require('../models/Post');
// const Profile = require('../models/Profile');
// const mockPosts = require('./__mocks__/posts');
// const mockProfiles = require('./__mocks__/profiles');
// const sinon = require('sinon');
// const passport = require('passport');

// // Configure chai
// chai.use(chaiHttp);
// chai.should();

// describe("Profiles", () => {
//   let db;

//   before(done => {
//     db = mongoose.connect("mongodb://localhost:27017/test")
//       .then(() => 
//         mockProfiles.forEach(function(profile) {
//           const newProfile = new Profile({
//             _id: profile._id,
//             skills: profile.skills,
//             date: profile.date,
//             user: profile.user,
//             handle: profile.handle,
//             company: profile.company,
//             website: profile.website,
//             location: profile.location,
//             status: profile.status,
//             social: profile.social,
//             // experience: profile.experience[0],
//             // education: profile.education[0],
//             bio: profile.bio
//           });
//           newProfile.save();
//         })
//     )
//     .then(() => done());
//   });

//   after(done => {
//     Profile
//       .remove({})
//       .then(() => mongoose.connection.close(done));
//   });

//   describe("Profiles /", () => {
//     it(`should return 400 code and 'name length validation error' json when doing POST to /register 
//         and name is too short`, (done) => {
//         let registerData =  
//         chai.request(app)
//           .get('/register')
//           .end((err, res) => {
//             res.should.have.status(200);
//             // console.log(res.body.length);
//             res.body.length.should.equal(2);
//             res.body.should.be.a('array');
//             done();
//           });
//         });
//     });
// });