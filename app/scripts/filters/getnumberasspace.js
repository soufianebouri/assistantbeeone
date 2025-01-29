'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:getNumberAsSpace
 * @function
 * @description
 * # getNumberAsSpace
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('getNumberAsSpace', function() {
    return function(input) {
      if (input != Infinity && !isNaN(input)) {
        return parseFloat(input).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace(/[.]00/g, "");
      } else {
        return "0";
      }
    }
  });