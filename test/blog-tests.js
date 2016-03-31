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

  it('POST for blog route', (done) => {
    request(port)
    .post('/blogs')
    .set('Authorization', 'Token ' + token)
    .send(blogTest)
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.title).to.eql('Basketball Is Fun2');
      done();
    });
  });
  it('should GET Blogs', (done) => {
    request(port)
      .get('/blogs')
      .set('Authorization', 'Token ' + token)
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.be.an('array');
        expect(res.body[0].author).to.eql('testAdmin2');
        done();
      });
  });
  it('should GET', (done) => {
    request(port)
      .get('/blogs/' + blogId)
      .set('Authorization', 'Token ' + token)
      .end(function (err, res) {
        console.log('This is blogId ' + blogId);
        expect(err).to.eql(null);
        console.log(res.text);
        expect(res.body.title).to.eql('Ken Griffey Died');
        done();
      });
  });
  it('should PUT', (done) => {
    console.log(blogId);
    request(port)
    .put('/blogs/' + blogId)
    .set('Authorization', 'Token ' + token)
    .send({title: 'April Fools, Ken Griffey Alive', date: 'May 29', author: 'bfein', content: 'This is our paragraph to save the day with', keywords: 'basketball baseball'})
    .end(function (err, res) {
      expect(err).to.eql(null);
      console.log(res.text);
      expect(res.text).to.eql('{"ok":1,"nModified":1,"n":1}');
      done();
    });
  });
  it('should DELETE', (done) => {
    request(port)
    .delete('/blogs/' + blogId)
    .set('Authorization', 'Token ' + token)
    .send({keywords: 'basketball baseball'})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.equal('{"msg":"Blog was removed"}');
      done();
    });
  });
});
