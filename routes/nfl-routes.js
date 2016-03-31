'use strict';
var nflScores = require("nfl_scores");

module.exports = (router) => {
  router.get('/scores/nfl', (req, res) => {
    nflScores.refresh(function(err, scores) {
      if(err) {
        console.log(err);
      }
    res.json(scores);
    });
  })
}
