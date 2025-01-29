'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ParcellePhysique
 * @description
 * # ParcellePhysique
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ParcellePhysique', function($http, _url) {
    return {
      getParcellePhysique: function(baseUrl, data) {
        return $http.get(baseUrl + "/parcelles/parcelleByNameID/" + data.IDFermes);
      },
      getAllParcellePhysique: function(baseUrl, IDFerme) {
        return $http.get(baseUrl + "/parcelles/" + IDFerme);
      },
      createParcellePhysique: function(baseUrl, data) {
        return $http.post(baseUrl + "/parcelles/", data);
      },
      updateParcellePhysique: function(baseUrl, data) {
        return $http.put(baseUrl + "/parcelles/", data);
      },
      deleteParcellePhysique: function(baseUrl, data) {
        return $http.post(baseUrl + "/parcelles/remove", data);
      },
      getAssolomentReport: function(data) {
        return $http.post(_url + "/parcelles/getAssolomentReport", data);
      }
    };
  });