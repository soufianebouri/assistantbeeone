'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.AspectVegetal
 * @description
 * # AspectVegetal
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('AspectVegetal', function($http, _url) {
    return {
      getAspectVegetal: function(d) {
        NProgress.start();
        return $http.post(_url + "/aspectVegetal/getSomeParams", d);
      },
      delete: function(d) {
        NProgress.start();
        return $http.post(_url + "/aspectVegetal/delete", d);
      },
      update: function(d) {
        NProgress.start();
        return $http.post(_url + "/aspectVegetal/update", d);
      }
    };
  });