'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:getNumberAsTonne
 * @function
 * @description
 * # getNumberAsTonne
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('getNumberAsTonne', function() {
    return function(input) {
      if (input != Infinity && input != 0) {
        if ((input > 999 || input < -999) && input != 0) {
          return (parseFloat((input / 1000)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " T";
        } else {
          return (parseFloat(input).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Kg";
        }
      } else {
        return "0 Kg";
      }
    }
  });