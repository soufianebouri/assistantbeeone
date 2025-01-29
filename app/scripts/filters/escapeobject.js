'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:escapeObject
 * @function
 * @description
 * # escapeObject
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('escapeObject', function() {
    return function(obj, es) {
      for (var i in obj) {
        if (es) {
          obj[i] = escape(obj[i]);
        } else {
          obj[i] = unescape(obj[i]);
          obj[i] = (obj[i] == 'null') ? '' : obj[i];
        }

      };
      return obj;
    };
  });