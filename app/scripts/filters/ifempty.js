'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:ifEmpty
 * @function
 * @description
 * # ifEmpty
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('ifEmpty', function() {
    return function(input, defaultValue) {
      if (angular.isUndefined(input) || input === null || input === '' || input === 'null' || input === 'undefined') {
        return defaultValue;
      }
      return input;
    }
  });