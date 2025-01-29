'use strict';

/**
 * @ngdoc directive
 * @name beeOneWebFrontApp.directive:fileupload
 * @description
 * # fileupload
 */
angular.module('beeOneWebFrontApp')
  .directive('fileModel', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function() {
          scope.$apply(function() {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    }
  }]);