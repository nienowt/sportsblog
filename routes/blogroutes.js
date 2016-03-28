'use strict';

var Blog = require('../models/blog');
var Keyword = require('../models/keywords')

module.exports = (router) => {

  router.post('/blogs', (req, res) => {
    console.log('blogs POST route hit');
    console.log(req.body.keywords)
    var keys = req.body.keywords.split(' ')


    var blog = new Blog(req.body);
    blog.save(function(err, data) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      keys.forEach((key) => {
        Keyword.findOne({keyword: key}, (err, keyword) => {
          if (err) console.log(err);
          if(!keyword) {
            var newKeyword =  new Keyword(
              {
                keyword: key,
                articles: [data._id]
              });
            newKeyword.save((err, data) => {
              if(err) console.log(err)
              console.log('Saved!')
              console.log(data);
              res.end();
            })
          } else if (keyword) {
            Keyword.findOneAndUpdate({keyword: key}, {$push: {'articles': data._id}}, (err) => {
              if(err) console.log(err);
            })
          }
          })
        })
      res.json(data);
    });
  })

  .put('/blogs/:blog', (req, res) => {
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

  .delete('/blogs/:blog', (req, res) => {
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
