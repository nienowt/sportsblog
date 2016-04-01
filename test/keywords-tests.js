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
var testParams = {
  name: 'testAdmin2',
  email: 'admin@test2.com',
  password: 'testpass',
  permissions: 'Admin'
};
var blogTest = {
  title: 'Basketball Is Fun2',
  date: 'May 29',
  author: 'Donald Trump',
  content: 'This is an article about sports',
  keywords: 'basketball politics'
};

process.env.MONGOLAB_URI = 'mongodb://localhost/test2';
require('../app.js');

describe('Testing POST and GET for /blogs routes', () => {
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
    .auth('admin@test2.com', 'testpass')
    .end(function(err, res) {
      token = res.headers.token;
      done();
    });
  });
  before((done) => {
    request(port)
     .post('/blogs')
     .set('Authorization', 'Token ' + token)
     .send({title: 'Ken Griffey Died', date: 'May 29', author: 'bfein', content: 'This is our paragraph to save the day with', keywords: 'basketball baseball'})
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
  it('should respond to post at /keywords/:keyword/follow by adding follower', (done) => {
    request(port)
    .post('/keywords/baseball/follow')
    .set('Authorization', 'Token ' + token)
    .end((err, res) => {
      var resText = JSON.parse(res.text);
      expect(err).to.eql(null);
      expect(resText.keyword).to.eql('baseball');
      expect(resText.followedBy[0]).to.eql(userId);
      done();
    });
  });
  it('should respond to post at /keywords/:keyword/unfollow by removing follower', (done) => {
    request(port)
    .post('/keywords/baseball/unfollow')
    .set('Authorization', 'Token ' + token)
    .end((err, res) => {
      var resText = JSON.parse(res.text);
      expect(err).to.eql(null);
      expect(resText.keyword).to.eql('baseball');
      expect(resText.followedBy[0]).to.eql(undefined);
      done();
    });
  });
  it('should respond to get at /keywords with array of keywords', (done) => {
    request(port)
    .get('/keywords')
    .set('Authorization', 'Token ' + token)
    .end((err, res) => {
      var resText = JSON.parse(res.text);
      expect(err).to.eql(null);
      expect(resText[0].keyword).to.eql('basketball');
      expect(resText[1].keyword).to.eql('baseball');
      done();
    });
  });
});
