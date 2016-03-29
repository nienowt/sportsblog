'use strict';

module.exports = function(app) {
  app.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.getAllPosts = function() {
      $http.get('/blogs').success(function(response){
        $scope.blogs = response;
      });
    };


  }]);
};
