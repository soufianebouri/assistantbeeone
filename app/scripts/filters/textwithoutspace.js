'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:TextWithoutSpace
 * @function
 * @description
 * # TextWithoutSpace
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('TextWithoutSpace', function () {
    return function (input) {
      return input.replace(/ /g, "_");
    };
  });
