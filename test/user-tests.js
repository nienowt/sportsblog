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
var testParams = {
  name: 'testAdmin',
  email: 'admin@test.com',
  password: 'testpass',
  permissions: 'Admin'
};

process.env.MONGOLAB_URI = 'mongodb://localhost/test';
require('../app.js');

describe('Testing POST and GET for /users routes', () => {
  it('should post a user', (done) => {
    request(port)
    .post('/users')
    .send(testParams)
    .end(function(err, res) {
      userId = res.body._id;
      expect(err).to.eql(null);
      expect(res.body.email).to.eql('admin@test.com');
      expect(res.body).to.have.property('_id');
      expect(res.body.password).to.not.eql('testpass');
      done();
    });
  });
  it('should login and return a token', (done) => {
    request(port)
    .post('/login')
    .auth('admin@test.com', 'testpass')
    .end(function(err, res) {
      expect(err).to.eql(null);
      token = res.headers.token;
      expect(res.body).to.have.property('token');
      done();
    });
  });
  it('should GET Users', (done) => {
    request(port)
      .get('/users')
      .set('Authorization', 'Token ' + token)
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.be.an('array');
        expect(res.body[0].email).to.eql('admin@test.com');
        done();
      });
  });
});

describe('get, put and delete users/:user route', function (){
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  it('should GET', (done) => {
    request(port)
      .get('/users/' + userId)
      .set('Authorization', 'Token ' + token)
      .end(function (err, res) {
        expect(err).to.eql(null);
        console.log('this is userId get' + userId);
        expect(res.body.email).to.eql('admin@test.com');
        done();
      });
  });
  it('should PUT', (done) => {
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
