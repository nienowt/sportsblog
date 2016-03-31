'use strict';

module.exports = function(app) {
  app.factory('Auth', ['$http', '$window', function($http, $window) {
    var token;
    var user;
    var auth = {
      createUser: function(user, cb) {
        cb = cb || function(){};
        $http.post('http://localhost:3000/users', user)
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
          url: 'http://localhost:3000/login',
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
      },
      getUsername: function(cb) {
        cb = cb || function(){};
        $http({
          method: 'GET',
          url: 'http://localhost:3000/users',
          headers: {
            token: auth.getToken()
          }
        })
        .then(function(res) {
          user = res.data.email;
          cb(res);
        },function(res) {
          cb(res);
        });
      },
      username: function() {
        if (!user) auth.getUsername();
        return user;
      }
    };
    return auth;
  }]);
};
