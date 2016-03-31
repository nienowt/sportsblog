'use strict';

module.exports = function(app) {
  app.factory('Auth', ['$http', '$window', function($http, $window) {
    var token;
    var user;
    var auth = {
      createUser: function(user, cb) {
        cb = cb || function(){};
        $http.post('/users', user)
          .then(function(res) {
            token = $window.localStorage.token = res.data.token;
            cb(null);
          }, function(res) {
            console.log(res);
            cb(res.err);
          });
      },
      signIn: function(user, cb) {
        cb = cb || function(){};
        $http({
          method: 'POST',
          url: '/login',
          headers: {
            'Authorization': 'Basic ' + btoa((user.email + ':' + user.password))
          }
        })
          .then(function(res) {
            token = $window.localStorage.token = res.data.token;
            cb(null);
          }, function(res) {
            console.log(res);
            cb(res);
          });
      },
      getToken: function() {
        token = token || $window.localStorage.token;
        return token;
      },
      signOut: function(cb) {
        $window.localStorage.token = null;
        token = null;
        user = null;
        if (cb) cb();
      }
    };
    return auth;
  }]);
};
