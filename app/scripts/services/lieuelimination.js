'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.LieuElimination
 * @description
 * # LieuElimination
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('LieuElimination', function($http,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      pushLieuElimination: function(baseUrl, data) {
        return $http.post(baseUrl + "/lieu_elimination/create", data);
      },
      getLieuElimination: function(baseUrl) {
        return $http.get(baseUrl + "/lieu_elimination");
      },
      deleteLieuElimination: function(baseUrl, data) {
        return $http.post(baseUrl + "/lieu_elimination/delete", data);
      },
      updateLieuElimination: function(baseUrl, data) {
        return $http.post(baseUrl + "/lieu_elimination/update", data);
      }
    };
  });
