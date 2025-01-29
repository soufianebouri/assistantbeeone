'use strict';

/**
 * @ngdoc directive
 * @name beeOneWebFrontApp.directive:stringToDate
 * @description
 * # stringToDate
 */
angular.module('beeOneWebFrontApp')
  .directive('stringToDate', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          return value;
        });
        ngModel.$formatters.push(function(value) {
          return (value) ? new Date(value) : value;
        });
      }
    }
  });