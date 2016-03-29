'use strict';

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
var request = chai.request;
var port = 'localhost:3000';
var token = '';


process.env.MONGOLAB_URI = 'mongodb://localhost/test';
require('../app.js');

describe('post route', function() {
  var testParams = {
    name: 'testName',
    email: 'test@test.com',
    password: 'testpass'
  };
  it('should post a user', function(done)  {
    request(port)
    .post('/users')
    .send(testParams)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.email).to.eql('test@test.com');
      expect(res.body).to.have.property('_id');
      expect(res.body.password).to.not.eql('testpass');
      done();
    });
  });
  it('should login and return a token', function(done)  {
    request(port)
    .post('/login')
    .auth('test@test.com', 'testpass')
    .end(function(err, res) {
      expect(err).to.eql(null);
      token = res.headers.token;
      // console.log(token);
      expect(res.body).to.have.property('token');
      done();
    });
  });
  var blogTest = {
  title: 'Basketball Is Fun',
  date: 'May 29',
  author: 'Donald Trump',
  content: 'This is an article about sports',
  keywords: 'basketball politics'
}
  it('POST for blog route', (done) => {
    request(port)
    .post('/blogs')
    .set('Authorization', 'Token ' + token)
    .send(blogTest)
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.title).to.eql('Basketball Is Fun');
      done();
    });
  });
  it('should GET Blogs', function(done) {
    request(port)
      .get('/blogs')
      .set('Authorization', 'Token ' + token)
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  it('should GET Users', function(done) {
    request(port)
      .get('/users')
      .set('Authorization', 'Token ' + token)
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});

var userId;
describe('get, put and delete users/:user route', function (){
  before((done) => {
    request(port)
     .post('/users')
     .send({name: 'testUser', email: 'testuser@test.com', password: '123'})
     .end((err, res) => {
       userId = res.body._id;
       done();
     });
  });
  it('should GET', function(done) {
    request(port)
      .get('/users/' + userId)
      .set('Authorization', 'Token ' + token)
      .end(function (err, res) {
        expect(err).to.eql(null);
        console.log(res.text);
        expect(res.body.email).to.eql('testuser@test.com');
        done();
      });
  });
  it('should PUT', function(done) {
    request(port)
    .put('/users/' + userId)
    .set('Authorization', 'Token ' + token)
    .send({name: 'testUser', email: 'testuserMod@test.com', password: '123'})
    .end(function (err, res) {
      expect(err).to.eql(null);
      console.log(res.text);
      expect(res.text).to.eql('{"ok":1,"nModified":1,"n":1}');
      done();
    });
  });
  it('should DELETE', (done) => {
    request(port)
    .delete('/users/' + userId)
    .set('Authorization', 'Token ' + token)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.equal('{"msg":"User was removed"}');
      done();
    });
  });

});

var blogId;
describe('get, put and delete blog/:blog route', function (){
  before((done) => {
    request(port)
     .post('/blogs')
     .set('Authorization', 'Token ' + token)
     .send({title: 'Ken Griffey Died', date: 'May 29', author: "bfein", content: "This is our paragraph to save the day with", keywords: "basketball baseball"})
     .end((err, res) => {
      //debugger;
       blogId = res.body._id;
       done();
     });
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  it('should GET', function(done) {
    request(port)
      .get('/blogs/' + blogId)
      .set('Authorization', 'Token ' + token)
      .end(function (err, res) {
        expect(err).to.eql(null);
        console.log(res.text);
        expect(res.body.title).to.eql('Ken Griffey Died');
        done();
      });
  });
  it('should PUT', function(done) {
    console.log(blogId)
    request(port)
    .put('/blogs/' + blogId)
    .set('Authorization', 'Token ' + token)
    .send({title: 'April Fools, Ken Griffey Alive', date: 'May 29', author: "bfein", content: "This is our paragraph to save the day with", keywords: "basketball baseball"})
    .end(function (err, res) {
      expect(err).to.eql(null);
      console.log(res.text);
      expect(res.text).to.eql('{"ok":1,"nModified":1,"n":1}');
      done();
    });
  });
  it('should DELETE', (done) => {

    console.log(blogId)
    request(port)
    .delete('/blogs/' + blogId)
    .set('Authorization', 'Token ' + token)
    .send({keywords: "basketball baseball"})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.equal('{"msg":"Blog was removed"}');
      done();
    });
  });

});
