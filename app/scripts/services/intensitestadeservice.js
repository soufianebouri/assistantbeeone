'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.IntensiteStadeService
 * @description
 * # IntensiteStadeService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('IntensiteStadeService', function($http) {
    return {
      pushStade: function(baseUrl, data) {
        return $http.post(baseUrl + "/intensite_stade/create", data);
      },
      getStade: function(baseUrl) {
        return $http.get(baseUrl + "/intensite_stade/");
      },
      deleteStade: function(baseUrl, data) {
        return $http.post(baseUrl + "/intensite_stade/delete", data);
      },
      updateStade: function(baseUrl, data) {
        return $http.post(baseUrl + "/intensite_stade/update", data);
      }
    };
  });