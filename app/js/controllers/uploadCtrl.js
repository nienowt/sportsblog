'use strict';

module.exports = function(app) {

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

    app.controller('uploadCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
      $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = 'http://localhost:3000/blogs/' + $scope.image.blogID + '/images';;
        fileUpload.uploadFileToUrl(file, uploadUrl);
      };
    }]);

};
