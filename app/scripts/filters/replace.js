'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:replace
 * @function
 * @description
 * # replace
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('replace', function() {
    return function(input, from, to) {

      if (input === undefined) {
        return;
      }

      var regex = new RegExp(from, 'g');
      return input.replace(regex, to);

    };
  });