process.env.NODE_ENV = 'test';

// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import app from '../server';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Posts", () => {
  describe("GET /", () => {
    // Test to get all Posts record
    it("should get all Posts record", (done) => {
        chai.request(app)
            .get('/api/posts')
            .end((err, res) => {
                res.should.have.status(200);
                // res.body.should.be.a('object');
                console.log(res.body);
                
                res.body.should.be.a('array');
                done();
            });
      });

      // Test to get single Posts record
    // it("should get a single Posts record", (done) => {
    //     // const id = 1;
    //     const id = '5ba78549d0a68f785a01836f';
        
    //     chai.request(app)
    //         .get(`/api/posts/${id}`)
    //         // .get(`/api/posts/5ba78549d0a68f785a01836f`)
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             done();
    //         });
    // });

  });
});