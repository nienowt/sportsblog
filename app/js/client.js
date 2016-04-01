'use strict';

require('angular/angular');
require('angular-route');

var app = angular.module('app', ['ngRoute']); // eslint-disable-line

require('./controllers/appController')(app);

require('./directives/appDirective')(app);

require('./services/auth')(app);


app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/articles', {
      templateUrl: 'html/list.html',
      controller: 'AppCtrl'
    })
    .when('/blogs/:_id', {
      templateUrl: 'html/singlepost.html',
      controller: 'AppCtrl'
    })
    .when('/newuser', {
      templateUrl: 'html/newuser.html',
      controller: 'AppCtrl'
    })
    .when('/login', {
      templateUrl: 'html/login.html',
      controller: 'AppCtrl'
    })
    .when('/post', {
      templateUrl: 'html/post.html',
      controller: 'AppCtrl'
    })
    .when('/imageupload', {
      templateUrl: 'html/imageupload.html',
      controller: 'AppCtrl'
    })
    .when('/', {
      templateUrl: 'html/list.html',
      controller: 'AppCtrl'
    });
}]);
