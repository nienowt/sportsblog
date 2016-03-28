'use strict';

var Blog = require('../models/blog');
var User = require('../models/user');
var auth = require('../lib/authenticate');

module.exports = (router) => {

  router.post('/blogs', auth, (req, res) => {
    console.log('blogs POST route hit');
    var blog = new Blog(req.body);
    // finding author name from header token
    User.findOne({_id: req.decodedToken._id})
      .then(user => {
        req.user = user;
        blog.author = user.name;
        blog.save(function(err, data) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }
          res.json(data);
        });
      })
      .catch(err => {
        console.log(err);
        res.status(418).json({msg: err});
      });
  })

  .put('/blogs/:blog', auth, (req, res) => {
    var blogId = req.params.blog;
    var newBlogInfo = req.body;
    Blog.update({_id: blogId}, newBlogInfo, function(err, blog) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: err});
      }
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).json({msg: 'Unable to locate ' + blogId });
      }
    });
  })

  .delete('/blogs/:blog', auth, (req, res) => {
    var blogId = req.params.blog;
    Blog.findOne({_id: blogId}, function(err, blog) {
      if (err){
        console.log(err);
        res.status(500).json(err);
      }
      blog.remove();
      res.json({msg: 'Blog was removed'});
    });
  })
  //get all
  .get('/blogs', (req, res) => {
    Blog.find({}, function(err, data) {
      console.log('blog get route hit');
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal Server Error'});
      }
      res.json(data);
    });
  })

  .get('/blogs/:blog', (req, res) => {
    var blogId = req.params.blog;
    Blog.findOne({_id: blogId}, function(err, blog) {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal server error'});
      }
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).json({msg: 'Unable to locate ' + blogId});
      }
    });
  });

};
