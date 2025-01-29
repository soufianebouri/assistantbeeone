'use strict';

/**
 * @ngdoc directive
 * @name beeOneWebFrontApp.directive:leftMenu
 * @description
 * # leftMenu
 */
angular.module('beeOneWebFrontApp')
  .directive('leftMenu', function() {
    return {
      templateUrl: 'views/sections/leftmenu.html',
      restrict: 'E',
      scope: false,
      link: function postLink(scope, element, attrs) {
        console.log("leftMenu directive linking.");
        $.getScript("./scripts/vendor/custom.min.js");
      }
    };
  });