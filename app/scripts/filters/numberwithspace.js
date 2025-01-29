'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:numberwithspace
 * @function
 * @description
 * # numberwithspace
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('numberwithspace', function() {
    return function(input) {
      if (input != Infinity && input != -Infinity || isNaN(input) || input != 0) {
        return parseFloat(input).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      } else {
        return "0";
      }
    };
  });