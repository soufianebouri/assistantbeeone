'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.analysequalitativefeuilles
 * @description
 * # analysequalitativefeuilles
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('analysequalitativefeuilles', function($http, _url) {
    return {
      getAnalyseQualitativeFeuilles: function(d) {
        NProgress.start();
        return $http.post(_url + "/analysequalitativefeuilles/getSomeParams", d);
      },
      create: function(d) {
        NProgress.start();
        return $http.post(_url + "/analysequalitativefeuilles/create", d);
      },
      update: function(d) {
        NProgress.start();
        return $http.post(_url + "/analysequalitativefeuilles/update", d);
      },
      delete: function(d) {
        NProgress.start();
        return $http.post(_url + "/analysequalitativefeuilles/delete", d);
      }
    };
  });