'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:getNumberAsTwoDIgits
 * @function
 * @description
 * # getNumberAsTwoDIgits
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('getNumberAsTwoDIgits', function() {
    return function(input) {
      if (input != Infinity && input != 0) {
        return (parseFloat(input).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      } else {
        return "0";
      }
    }
  });