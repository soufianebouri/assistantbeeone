'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:AsTwoDigit
 * @function
 * @description
 * # AsTwoDigit
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('AsTwoDigit', function() {
    return function(input) {
      if (input != Infinity && !isNaN(input)) {
        return (Math.round(input * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      } else {
        return "0";
      }
    }
  }).filter('AsTwoDigitForExel', function() {
    return function(input) {
      if (input != Infinity && !isNaN(input)) {
        return (Math.round(input * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace(".", ",");
      } else {
        return "0";
      }
    }
  });