'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:dayname
 * @function
 * @description
 * # dayname
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('dayname', function() {
    return function(input) {
      var myday = moment(input, "DD-MM-YYYY");
      return myday.locale('fr').format('dddd');
    };
  })
  .filter('daymounth', function() {
    return function(input) {
      var myday = moment(input, "DD-MM-YYYY");
      return myday.format("MM/YYYY");
    };
  });