'use strict';

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
var request = chai.request;
var port = 'localhost:3000';
var token = '';
var userId = '';
var blogId;
var commentsId;
var testParams = {
  name: 'testAdmin4',
  email: 'admin@test4.com',
  password: 'testpass',
  permissions: 'Admin'
};

process.env.MONGOLAB_URI = 'mongodb://localhost/test4';

describe('Testing Search route', () => {
  before((done) => {
    request(port)
    .post('/users')
    .send(testParams)
    .end(function(err, res) {
      userId = res.body._id;
      done();
    });
  });
  before((done) => {
    request(port)
    .post('/login')
    .auth('admin@test4.com', 'testpass')
    .end(function(err, res) {
      token = res.headers.token;
      done();
    });
  });
  before((done) => {
    request(port)
     .post('/blogs')
     .set('Authorization', 'Token ' + token)
     .send({title: 'Hats', date: 'May 29', author: 'bfein', content: 'This is our paragraph to save the day with', keywords: 'basketball baseball'})
     .end((err, res) => {
       blogId = res.body._id;
       done();
     });
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  it('GET /search/keywords/:keyword route', (done) => {
    request(port)
    .get('/search/keywords/basketball')
    .set('Authorization', 'Token ' + token)
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.be.an('array');
      done();
    });
  });
  it('GET /search/:search route', (done) => {
    request(port)
    .get('/search/Hats')
    .set('Authorization', 'Token ' + token)
    .end((err, res) => {
      expect(err).to.eql(null);
      var searchRes = JSON.parse(res.text);
      expect(searchRes[0].title).to.eql('Hats');
      done();
    });
  });
});
