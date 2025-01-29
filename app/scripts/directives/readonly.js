'use strict';

/**
 * @ngdoc directive
 * @name beeOneWebFrontApp.directive:readonly
 * @description
 * # readonly
 */
angular.module('beeOneWebFrontApp')
  .directive('readonly', function readOnly() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      element.find("input")[0].setAttribute("readonly", "true");
      element.find("input").bind('click', function() {
        element.find("button")[0].click();
      });
    }
  });