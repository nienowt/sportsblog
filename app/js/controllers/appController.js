'use strict';

module.exports = function(app) {
  app.controller('AppCtrl', ['$scope', '$http', '$location', 'Auth', function($scope, $http, $location, Auth) {

    $scope.getAllPosts = function() {
      $http.get('/blogs').success(function(response){
        $scope.blogs = response;
      });
    };

    $scope.submitSignIn = function(user) {
      Auth.signIn(user, function() {
        $location.path('/');
      });
    };

    $scope.logMeOut = function() {
      Auth.signOut();
      $location.path('/login');
      console.log('signed out');
    };

    $scope.signup = true;
    $scope.submitSignUp = function(user) {
      Auth.createUser(user, function() {
        $location.path('/login');
      });
    };

    $scope.postBlog = function(newBlog) {
      $http({
        method: 'POST',
        url: '/blogs',
        headers: {
          'Authorization': 'Token ' + Auth.getToken()
        },
        data: newBlog
      })
      .success(function (data){
        console.log(data);
        $location.path('/');
      });
    };

    $scope.uploadImage = function(image) {
      var idUrl = '/blogs/' + $scope.image.blogID + '/images';
      var fd = new FormData();
      fd.append('file', $scope.image.imgFile);
      $http({
        method: 'PUT',
        url: idUrl,
        headers: {
          'Authorization': 'Token ' + Auth.getToken(),
          'Content-Type': 'multipart/mixed',
          'Position': $scope.image.position
        },
        data: fd
      })
      .success(function (data){
        console.log(data);
        $location.path('/');
      });
    };

  }]);
};
