'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:floatastwodigits
 * @function
 * @description
 * # floatastwodigits
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('floatastwodigits', function() {
    return function(input) {
      if (angular.isUndefined(input) || input === null || input === '' || input === 'null' || input === 'undefined' || input === Infinity || isNaN(input)) {
        return 0;
      }
      return parseFloat(input.toFixed(2));
    }
  });