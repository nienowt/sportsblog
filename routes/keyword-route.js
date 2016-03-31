'use strict';

var Blog = require('../models/blog');
var Keyword = require('../models/keywords');
var User = require('../models/user');
var auth = require('../lib/authenticate');



module.exports = (router) => {

  router.post('/keywords/:keyword/follow',auth, (req, res) => {
    Keyword.findOneAndUpdate({keyword: req.params.keyword}, {$addToSet: {'followedBy': req.decodedToken._id}}, (err, keyword) => {
      if (err) console.log(err);
      if (!keyword) {
        res.write('keyword does not exist');
        res.end();
      }
      User.findByIdAndUpdate(req.decodedToken._id, {$addToSet: {'following': keyword._id}}, (err) => {
        if(err) console.log(err);
      });
      res.end();
    });
  })

  .post('/keywords/:keyword/unfollow', auth, (req, res) => {
    Keyword.findOneAndUpdate({keyword: req.params.keyword}, {$pull: {'followedBy': req.decodedToken._id}}, (err, keyword) => {
      if (err) console.log(err);
      if (!keyword) {
        res.write('keyword does not exist');
        res.end();
      }
      User.findByIdAndUpdate(req.decodedToken._id, {$pull: {'following': keyword._id}}, (err) => {
        if(err) console.log(err);
      });
      res.end();
    });
  })

  .get('/keywords', (req, res) => {
    Keyword.find({}, (err,keywords) => {
      res.json(keywords);
      res.end();
    });
  });
};
