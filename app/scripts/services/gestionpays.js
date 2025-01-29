'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.gestionPays
 * @description
 * # gestionPays
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('gestionPays', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      pushPays: function(baseUrl, data) {
        return $http.post(baseUrl + "/pays/create", data);
      },
      getPays: function(baseUrl) {
        return $http.get(baseUrl + "/pays");
      },
      deletePays: function(baseUrl, data) {
        return $http.post(baseUrl + "/pays/delete", data);
      },
      updatePays: function(baseUrl, data) {
        return $http.post(baseUrl + "/pays/update", data);
      },
      getCountriesWithData: function(baseUrl, data) {
        return $http.get(baseUrl + "/pays/countriesWithData");
      },
      pushCountriesWithData: function(baseUrl, data) {
        return $http.post(baseUrl + "/pays/insertCountriesWithData", data);
      },
      updateCountriesWithData: function(baseUrl, data) {
        return $http.post(baseUrl + "/pays/updateCountriesWithData", data);
      },
      getRegionData: function(baseUrl, data) {
        return $http.post(baseUrl + "/region/byIdPay", data);
      },
      pushRegionData: function(baseUrl, data) {
        return $http.post(baseUrl + "/region/create", data);
      },
      deleteZone: function(baseUrl, data) {
        return $http.post(baseUrl + "/zone/deleteZone", data);
      },
      deleteRegion: function(baseUrl, data) {
        return $http.post(baseUrl + "/region/deleteRegion", data);
      },
      getregion: function() {
        return $http.post(_url + "/region/getregion");
      },
      getzone: function() {
        return $http.post(_url + "/zone/getzone");
      }
    };
  });
