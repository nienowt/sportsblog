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
  name: 'testAdmin3',
  email: 'admin@test3.com',
  password: 'testpass',
  permissions: 'Admin'
};
// var blogTest = {
//   title: 'Basketball Is Fun2',
//   date: 'May 29',
//   author: 'Donald Trump',
//   content: 'This is an article about sports',
//   keywords: 'basketball politics'
// };
process.env.MONGOLAB_URI = 'mongodb://localhost/test3';

describe('Testing POST for /blogs/:blog/comments route', () => {
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
    .auth('admin@test3.com', 'testpass')
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
  it('POST for comments route', (done) => {
    request(port)
    .post('/blogs/' + blogId + '/comments')
    .set('Authorization', 'Token ' + token)
    .send({comment: 'Yeee!'})
    .end(function (err, res) {
      commentsId = res.body._id;
      expect(err).to.eql(null);
      expect(res.body.comment).to.eql('Yeee!');
      done();
    });
  });
  it('DELETE for comments route', (done) => {
    request(port)
    .delete('/blogs/' + blogId + '/comments/' + commentsId)
    .set('Authorization', 'Token ' + token)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.equal('comment removed');
      done();
    });
  });
});
