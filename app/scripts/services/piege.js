'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.Piege
 * @description
 * # Piege
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Piege', function($http, _url) {
    return {
      pushPiege: function(baseUrl, data) {
        return $http.post(baseUrl + "/piege/create", data);
      },
      getPiege: function(data) {
        return $http.post(_url + "/piege/showSomeProp/", data);
      },
      deletePiege: function(baseUrl, data) {
        return $http.post(baseUrl + "/piege/delete", data);
      },
      updatePiege: function(baseUrl, data) {
        return $http.post(baseUrl + "/piege/update", data);
      },
      getPiegeByParcel: function(baseUrl, data) {
        return $http.post(baseUrl + "/piege/getPiegeByParcel", data);
      },
      getPiegeByFerme: function(data) {
        return $http.get(_url + "/get_piege/" + data);
      },
      getPiegeByParcelCible: function(data) {
        return $http.post(_url + "/piege/getPiegeByParcelCible", data);
      },
      getPiegeByCible: function(data) {
        return $http.post(_url + "/piege/getPiegeByCible", data);
      }
    };
  });