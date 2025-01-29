'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.NiveauColorationService
 * @description
 * # NiveauColorationService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('NiveauColorationService', function($http, _url) {
    return {
      pushColoration: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_coloration/create", data);
      },
      getColoration: function(baseUrl) {
        return $http.get(baseUrl + "/niveau_coloration/list");
      },
      deleteColoration: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_coloration/delete", data);
      },
      updateColoration: function(baseUrl, data) {
        return $http.post(baseUrl + "/niveau_coloration/update", data);
      },
      getColorationbyculture: function(data) {
        return $http.post(_url + "/niveau_coloration/getColorationbyculture", data);
      },
      getColorationbymulticulture: function(data) {
        return $http.post(_url + "/niveau_coloration/getColorationbymulticulture", data);
      }
    };
  });