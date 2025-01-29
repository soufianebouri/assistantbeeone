'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.NiveauAttaque
 * @description
 * # NiveauAttaque
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('NiveauAttaque', function($http,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      pushNiveauAttaque: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_attaque/create", data);
      },
      getNiveauAttaque: function(baseUrl) {
        return $http.get(baseUrl + "/niveau_attaque");
      },
      deleteNiveauAttaque: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_attaque/delete", data);
      },
      updateNiveauAttaque: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_attaque/update", data);
      }
    };
  });
