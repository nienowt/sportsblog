'use strict';

var nytTop = require('nyt-top');
nytTop.key(process.env.NY_TIMES_TOKEN);

module.exports = (router) => {
  router.get('/sportnews', (req, res) => {
    nytTop.section('sports', function (err, data) {
      if (err) { console.log(err); }
      else {
        var results = data.results;
        /*for (var i = 0; i < 10; i++) { // top ten most recent stories
        //res.json(results);
        }*/
        res.json(results);
      }
    });
  });
};
