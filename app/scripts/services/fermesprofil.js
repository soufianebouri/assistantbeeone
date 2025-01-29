'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.FermesProfil
 * @description
 * # FermesProfil
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('FermesProfil', function($http) {
    return {
      pushFermesProfil: function(baseUrl, data) {
        return $http.post(baseUrl + "/fermeProfil/create", data);
      },
      getFermesProfil: function(baseUrl) {
        return $http.get(baseUrl + "/fermeProfil/showSomeProps");
      },
      deleteFermesProfil: function(baseUrl, data) {
        return $http.post(baseUrl + "/fermeProfil/delete", data);
      },
      updateFermesProfil: function(baseUrl, data) {
        return $http.post(baseUrl + "/fermeProfil/update", data);
      }
    };
  });