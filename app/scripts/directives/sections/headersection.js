'use strict';

/**
 * @ngdoc directive
 * @name beeOneWebFrontApp.directive:headerSection
 * @description
 * # headerSection
 */
angular.module('beeOneWebFrontApp')
  .directive('headerSection', function() {
    return {
      templateUrl: 'views/sections/header.html',
      restrict: 'E',
      scope: false,
      link: function postLink(scope, element, attrs) {
        ///console.log("header directive linking.");
      }
    };
  });