'use strict';

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
var request = chai.request;
var port = 'localhost:3000';

process.env.MONGOLAB_URI = 'mongodb://localhost/test5';


describe('Testing POST subscribe and unsubscribe routes', () => {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  it('should POST for subscriber route', (done) => {
    request(port)
    .post('/subscribe')
    .send({email: 'testemail@email.com'})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.email).to.eql('testemail@email.com');
      done();
    });
  });
  it('DELETE for comments route', (done) => {
    request(port)
    .post('/unsubscribe')
    .send({email: 'testemail@email.com'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.equal('{"msg":"You are unsubscribed"}');
      done();
    });
  });
});
