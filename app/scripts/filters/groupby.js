'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:groupBy
 * @function
 * @description
 * # groupBy
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('groupBy', function($parse) {
    return _.memoize(function(items, field) {
      var getter = $parse(field);
      return _.groupBy(items, function(item) {
        return getter(item);
      });
    });
  });