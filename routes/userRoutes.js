'use strict';

var User = require('../models/user');
var auth = require('../lib/authenticate');

module.exports = (router) => {

  router.post('/users', (req, res) => {
    console.log('users POST route hit');
    var user = new User(req.body);
    user.save(function(err, data) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      res.json(data);
    });
  })

  .put('/users/:user', (req, res) => {
    var userId = req.params.user;
    var newUserInfo = req.body;
    User.update({_id: userId}, newUserInfo, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: err});
      }
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({msg: 'Unable to locate ' + userId });
      }
    });
  })

  .delete('/users/:user', (req, res) => {
    var userId = req.params.user;
    User.findOne({_id: userId}, function(err, user) {
      if (err){
        console.log(err);
        res.status(500).json(err);
      }
      user.remove();
      res.json({msg: 'User was removed'});
    });
  })

  .get('/users', (req, res) => {
    User.find({}, function(err, data) {
      console.log('get route hit');
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal Server Error'});
      }
      res.json(data);
    });
  })

  .get('/users/:user', (req, res) => {
    var userId = req.params.user;
    User.findOne({_id: userId}, function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal server error'});
      }
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({msg: 'Unable to locate ' + userId});
      }
    });
  });

};
