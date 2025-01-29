'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:textforsqlserver
 * @function
 * @description
 * # textforsqlserver
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('textforsqlserver', function() {
    return function(input) {
      if (input)
        return input.replace(/'/g, "''");
      return ""
    };
  })
  .filter('textforsqlserver_nullsupport', function() {
    return function(input) {
      if (input)
        return input.replace(/'/g, "''");
      return null
    };
  });