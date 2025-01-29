'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.NiveauConformite
 * @description
 * # NiveauConformite
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('NiveauConformite', function($http,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      pushNiveauConformite: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_conformite/create", data);
      },
      getNiveauConformite: function(baseUrl) {
        return $http.get(baseUrl + "/niveau_conformite");
      },
      deleteNiveauConformite: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_conformite/delete", data);
      },
      updateNiveauConformite: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_conformite/update", data);
      }
    };
  });
