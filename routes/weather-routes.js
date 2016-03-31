var weather = require('openweather-apis');

module.exports = (router) => {
  weather.setAPPID(process.env.OPEN_WEATHER_TOKEN);
  weather.setLang('en');
  weather.setUnits('imperial');
  router.get('/whistler', (req, res) => {
    weather.setCityId(6180144);
    weather.getWeatherForecastForDays(3, function(err, obj){
      if(err) {
        console.log(err);
      //return res.status(500);
      }
      //console.log(obj.list);
      var whistler = obj;
      console.log('hitting whistler');
      console.log(whistler);
      res.json(whistler);
    });
  });
  router.get('/seattle', (req, res) => {
    weather.setCityId(5809844);
    weather.getWeatherForecastForDays(3, function(err, obj){
      if(err) {
        console.log(err);
      }
      var seattle = obj;
      console.log('hitting seattle');
      res.json(seattle);
      //res.end();
    });
  });
  router.get('/newyork', (req, res) => {
    weather.setCityId(5128581);
    weather.getWeatherForecastForDays(3, function(err, obj){
      if(err) {
        console.log(err);
      }
      var newyork = obj;
      console.log('hitting newyork city');
      res.json(newyork);
    });
  });
};
