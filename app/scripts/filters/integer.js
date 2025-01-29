'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:integer
 * @function
 * @description
 * # integer
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('integer', function() {
    return function(input) {
      return (Math.round(input, 10)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }).filter('round', function() {
    return function(input) {
      if (input)
        return Math.round(input)
      return 0
    }
  }).filter('toFixed', function() {
    return function(input) {
      try {
        if (input)
          return input.toFixed(2)
        return 0
      } catch (e) {
        return 0
      }
    }
  }).filter('toInteger', function() {
    return function(input) {
      try {
        if (input)
          return parseInt(input)
        return 0
      } catch (e) {
        return 0
      }
    }
  });;