var mlb = require('mlb-scores');

module.exports = (router) => {
  router.get('/scores/mlb/cubs', (req, res) => {
    mlb.getGameUrl('cubs', new Date(2016,3, 29), function(err, url){
      if (!err){
        mlb.getGameInfo(url, function(err, data){
          console.log('Cub information');
          res.json(data);
        });
      }
    });
  });
  router.get('/scores/mlb/mariners', (req, res) => {
    mlb.getGameUrl('mariners', new Date(2016,3, 29), function(err, url){
      if (!err){
        mlb.getGameInfo(url, function(err, data){
          console.log('Mariner Information');
          res.json(data);
        });
      }
    });
  });
  router.get('/scores/mlb/cardinals', (req, res) => {
    mlb.getGameUrl('cardinals', new Date(2016,3, 29), function(err, url){
      if (!err){
        mlb.getGameInfo(url, function(err, data){
          console.log('Cardinal information');
          res.json(data);
        });
      }
    });
  });
  router.get('/scores/mlb/twins', (req, res) => {
    mlb.getGameUrl('twins', new Date(2016,3, 29), function(err, url){
      if (!err){
        mlb.getGameInfo(url, function(err, data){
          console.log('Twin information');
          res.json(data);
        });
      }
    });
  });
  router.get('/scores/mlb/yankees', (req, res) => {
    mlb.getGameUrl('yankees', new Date(2016,3, 29), function(err, url){
      if (!err){
        mlb.getGameInfo(url, function(err, data){
          console.log('Yankee information');
          res.json(data);
        });
      }
    });
  });
  router.get('/scores/mlb/royals', (req, res) => {
    mlb.getGameUrl('royals', new Date(2016,3, 29), function(err, url){
      if (!err){
        mlb.getGameInfo(url, function(err, data){
          console.log('Royals information');
          res.json(data);
        });
      }
    });
  });
  router.get('/scores/mlb/athletics', (req, res) => {
    mlb.getGameUrl('athletics', new Date(2016,3, 29), function(err, url){
      if (!err){
        mlb.getGameInfo(url, function(err, data){
          console.log('Athletics information');
          res.json(data);
        });
      }
    });
  });
  router.get('/scores/mlb/angels', (req, res) => {
    mlb.getGameUrl('angels', new Date(2016,3, 29), function(err, url){
      if (!err){
        mlb.getGameInfo(url, function(err, data){
          console.log('Angel information');
          res.json(data);
        });
      }
    });
  });
};
