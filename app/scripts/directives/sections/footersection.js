'use strict';

/**
 * @ngdoc directive
 * @name beeOneWebFrontApp.directive:footerSection
 * @description
 * # footerSection
 */
angular.module('beeOneWebFrontApp')
  .directive('footerSection', function() {
    return {
      templateUrl: 'views/sections/footer.html',
      restrict: 'E',
      scope: false,
      link: function postLink(scope, element, attrs) {
        console.log("footer directive linking.");
      }
    };
  });