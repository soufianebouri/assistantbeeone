'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:floatasNBRdigits
 * @function
 * @description
 * # floatasNBRdigits
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('floatasNBRdigits', function() {
    return function(input, nbr) {
      if (angular.isUndefined(input) || input === null || input === '' || input === 'null' || input === 'undefined' || input === Infinity || isNaN(input)) {
        return 0;
      }
      console.log("parsed float",parseFloat(input.toFixed(nbr)));
      return parseFloat(input.toFixed(nbr));
    }
  });