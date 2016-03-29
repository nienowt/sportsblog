'use strict';

require('angular/angular');
require('angular-route');

var app = angular.module('app', ['ngRoute']);

require('./controllers/appController')(app);

require('./directives/appDirective')(app);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/articles', {
      templateUrl: 'html/list.html',
      controller: 'AppCtrl'
    })
    .when('/', {
      templateUrl: 'html/list.html',
      controller: 'AppCtrl'
    });
}]);
