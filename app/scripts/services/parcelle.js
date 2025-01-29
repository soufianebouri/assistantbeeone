'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.parcelle
 * @description
 * # parcelle
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('parcelleCultural', function($http) {
    return {
      //byIdFerme
      getParcelleCultural: function(baseUrl, data) {
        return $http.post(baseUrl + "/parcellesculturale/showByNameID", data);
      },
      getAllParcelleCultural: function(baseUrl) {
        return $http.get(baseUrl + "/parcellesculturale/listParcelWithIdName");
      }
    };
  });
