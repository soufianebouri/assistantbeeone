'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.familleoperations
 * @description
 * # familleoperations
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('familleoperations', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getall: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleoperations/getall", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleoperations/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleoperations/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleoperations/delete", data);
      }
    };
  });
