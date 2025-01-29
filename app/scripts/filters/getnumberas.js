'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:getNumberAs
 * @function
 * @description
 * # getNumberAs
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('getNumberAs', function() {
    return function(input) {
      if (input != Infinity) {
        if ((input > 999 || input < -999) && input != 0) {
          return (Math.round(input / 1000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " K";
        } else {
          return (Math.round(input)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ";
        }
      } else {
        return "0";
      }
    }
  })
  .filter('AsNum', function() {
    return function(input) {
      return parseInt(input);
    }
  });