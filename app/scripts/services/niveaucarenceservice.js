'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.NiveauCarenceService
 * @description
 * # NiveauCarenceService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('NiveauCarenceService', function($http) {
    return {
      pushCarence: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_carance/create", data);
      },
      getCarence: function(baseUrl) {
        return $http.get(baseUrl + "/niveau_carance/list");
      },
      deleteCarence: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_carance/delete", data);
      },
      updateCarence: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_carance/update", data);
      }
    };
  });