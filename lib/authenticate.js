'use strict';

var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  var decoded;
  try {
    var token = req.headers.authorization.split(' ')[1];
    decoded = jwt.verify(token, process.env.SECRET || 'change me');
    req.decodedToken = decoded;
    next();
  }
  catch (err) {
    return res.status(418).json({msg: 'stupid teapot'});
  }
  // The block of code below doesn't work for routes that also look up users to perform their functions, such as put and delete
  var User = require('../models/user');
  User.findOne({_id: decoded._id})
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => {
    console.log(err);
    res.status(418).json({msg: err});
  });
};
