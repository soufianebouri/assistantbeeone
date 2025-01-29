'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.Cible
 * @description
 * # Cible
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Cible', function($http, _url, $translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getCible: function() {
        console.log(_url)
        return $http.get(_url + "/cible/byIdName/");
      },
      getAllCible: function() {
        return $http.get(_url + "/cible");
      },
      create: function(data) {
        return $http.post(_url + "/cible/create", data);
      },
      update: function(data) {
        return $http.post(_url + "/cible/update", data);
      },
      delete: function(data) {
        return $http.post(_url + "/cible/delete", data);
      }
    };
  });
