'use strict';

var Blog = require('../models/blog');

var auth = require('../lib/authenticate');

var Keyword = require('../models/keywords');

module.exports = (router) => {

  router.get('/search/keywords/:keyword',auth, (req, res) => { // --------- maybe don't need this?
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
    var key = new RegExp(req.params.search, 'i')
    Blog.find({}, (err, blogs) => {
      var results = [];
      var count = 0;
      blogs.forEach((blog) => {
        count += 1;
        if (blog.title.search(key) !== -1 || blog.author.search(key) !== -1 || blog.date === key || blog.keywords[0].search(key) !== -1) {
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
