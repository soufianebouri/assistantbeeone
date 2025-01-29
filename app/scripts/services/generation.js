'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.generation
 * @description
 * # generation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('generation', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      byculture: function(data) {
        NProgress.start();
        return $http.post(_url + "/generation/byculture", data);
      },
      getall: function(data) {
        NProgress.start();
        return $http.post(_url + "/generation/getall", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/generation/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/generation/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/generation/delete", data);
      }
    };
  });
