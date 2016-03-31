'use strict';

module.exports = function(app) {
  app.controller('AppCtrl', ['$scope', '$http', '$location', 'Auth', function($scope, $http, $location, Auth) {

    $scope.getAllPosts = function() {
      $http.get('/blogs').success(function(response){
        $scope.blogs = response;
      });
    };

    $scope.username = null;
    $scope.updateUsername = function() {
      Auth.getUsername(function(res) {
        console.log(res);
        $scope.username = res.data.email;
      });
    };

    $scope.submitSignIn = function(user) {
      Auth.signIn(user, function() {
        // $scope.updateUsername();
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
        // $scope.updateUsername(); erroring out
        $location.path('/login');
      });
    };

    $scope.postBlog = function(newBlog) {
      $http({
        method: 'POST',
        url: 'http://localhost:3000/blogs',
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

    // $scope.uploadImage = function(image) {
    //   var idUrl = 'http://localhost:3000/blogs/' + image.blogID + '/images';
    //   var fd = new FormData();
    //   fd.append('file', image.imgFile);
    //   $http({
    //     method: 'PUT',
    //     url: idUrl,
    //     transformRequest: angular.identity,
    //     headers: {
    //       'Authorization': 'Token ' + Auth.getToken(),
    //       'Content-Type': 'multipart/mixed',
    //       'Position': image.position
    //     },
    //     data: fd
    //   })
    //   .success(function (data){
    //     console.log(data);
    //     $location.path('/');
    //   });
    // };
    app.directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          element.bind('change', function(){
            scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
            });
          });
        }
      };
    }]);

    app.service('fileUpload', ['$http', '$scope', function ($http, $scope) {
      this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http({
          method: 'PUT',
          url: uploadUrl,
          transformRequest: angular.identity,
          headers: {
            'Authorization': 'Token ' + Auth.getToken(),
            'Content-Type': 'multipart/mixed',
            'Position': $scope.image.position
          },
          data: fd
        })
        .success(function(data){
          console.log(data);
          $location.path('/');
        })
        .error(function(err){
          console.log(err);
        });
      }
    }]);

    app.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
      $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = 'http://localhost:3000/blogs/' + $scope.image.blogID + '/images';;
        fileUpload.uploadFileToUrl(file, uploadUrl);
      };
    }]);

  }]);
};
