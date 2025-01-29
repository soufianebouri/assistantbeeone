'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:setMonthName
 * @function
 * @description
 * # setMonthName
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('setMonthName', function() {
    return function(input) {
      switch (input) {
        case "1":
          return "janvier"
          break;
        case "2":
          return "février"
          break;
        case "3":
          return "mars"
          break;
        case "4":
          return "avril"
          break;
        case "5":
          return "mai"
          break;
        case "6":
          return "juin"
          break;
        case "7":
          return "juillet"
          break;
        case "8":
          return "août"
          break;
        case "9":
          return "septembre"
          break;
        case "10":
          return "octobre"
          break;
        case "11":
          return "novembre"
          break;
        case "12":
          return "décembre"
          break;
        default:
          return "Error finding month"
          break;
      }
    }
  });