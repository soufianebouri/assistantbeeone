'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:trustAsResourceUrl
 * @function
 * @description
 * # trustAsResourceUrl
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
      return $sce.trustAsResourceUrl(val);
    };
  }])