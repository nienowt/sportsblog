'use strict';

var Blog = require('../models/blog');

var auth = require('../lib/authenticate');

var Keyword = require('../models/keywords');

module.exports = (router) => {

  router.get('/search/keywords/:keyword',auth, (req, res) => {
    var key = req.params.keyword;
    Keyword.find({keyword: key})
    .populate('articles')
    .exec((err, data) => {
      if(err || data.length === 0){
        res.json('No results found');
        return res.end();
      }
      if(data) {
        res.json(data);
        res.end();
      }
    });
  })

  .get('/search/:search',auth, (req, res) => {
    var key = req.params.search;
    Blog.find({}, (err, blogs) => {
      var results = [];
      var count = 0;
      blogs.forEach((blog) => {
        count += 1;
        if (blog.title === key || blog.author === key || blog.date === key) {
          results.push(blog);
        }
      });
      if (count === blogs.length) {
        if(results.length !== 0){
          res.json(results);
        } else {
          res.write('No results found');
        }
        res.end();
      }
    });
  });
};
