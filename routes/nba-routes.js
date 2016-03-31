var nba = require('nbapackage');

module.exports = (router) => {
  router.get('/scores/nba', function(req, res) {
    nba.games('20160329', function(err, data) {
      res.json(data);
    });
  });
}
