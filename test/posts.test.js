const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require("mongoose");

const Post = require('../models/Post');
const Profile = require('../models/Profile');
const mockPosts = require('./__mocks__/posts');
const mockProfiles = require('./__mocks__/profiles');
const sinon = require('sinon');
const passport = require('passport');
const addLikeToPost = require('../routes/api/posts').addLikeToPost;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("/api/posts/", () => {
  let db;

  before(done => {
    
    db = mongoose.connect("mongodb://localhost:27017/test")
      .then(() => 
        mockPosts.forEach(function(post) {
          const newPost = new Post({
            _id: post._id,
            text: post.text,
            name: post.name,
            user: post.user,
            date: post.date,
            avatar: post.avatar,
            likes: post.likes,
            comments: post.comments
          });
          newPost.save();
        })
    )
    .then(() => done());
  });

  after(done => {
    Post
      .remove({})
      .then(() => mongoose.connection.close(done));
  });

  let user = {
    date: '2018-11-11T00:04:19.666Z',
    _id: '5be772318a0efa11e7a68014',
    name: 'Oisín Foley',
    email: 'oisinfoleysligo@gmail.com',
    avatar: 'https://angel.co/cdn-cgi/image/width=200,height=200,format=auto,fit=cover/https://d1qb2nb5cznatu.cloudfront.net/users/2094932-original?1563725982',
    password: '$2a$10$JaKVGehh7FK.sqUIlL5QWO.vL2Ux2dvXSHKnPzyDmh1HzFFxYPNpO'
  };

  
    describe(`Testing sinon stub of jwt.authenticate`, () => {

      sinon.stub(passport,"authenticate").callsFake((strategy, options) => {            
        // callback(null, { "username": "test@techbrij.com"}, null);             
        return (req,res,next)=>user;
     });

      it.only(`should add a like to the post,
        and return 200 status code`, (done) => {
        const id = mockPosts[0]._id;
        chai.request(app)
          .post(`/api/posts/like/${id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

});