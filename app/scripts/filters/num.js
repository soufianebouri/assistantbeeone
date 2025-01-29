'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:num
 * @function
 * @description
 * # num
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('num', function() {
    return function(input) {
      return Math.round(input, 10);
    }
  });