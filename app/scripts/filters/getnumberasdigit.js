'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:getNumberAsDigit
 * @function
 * @description
 * # getNumberAsDigit
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('getNumberAsDigit', function() {
    return function(input) {
      if (input > 999) {
        return (input / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " K";
      } else {
        return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ";
      }
    }
  });