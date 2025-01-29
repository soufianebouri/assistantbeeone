'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.Tbrendement
 * @description
 * # Tbrendement
 * Service in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('tbrendement', function($http, _url) {
    return {
      getCulture: function(d) {
        NProgress.start();
        return $http.get(_url + "/cultures/ByFerme/" + d.FERME);
      },
      getCultureSuperficie: function(d) {
        NProgress.start();
        return $http.post(_url + "/recolteadate/superficieculture/", d);
      },
      getRecolteADate: function(d) {
        NProgress.start();
        return $http.post(_url + "/recolteadate/adate/", d);
      },
      getRecolteToday: function(d) {
        NProgress.start();
        return $http.post(_url + "/recolteadate/today/", d);
      },
      getRecolteByCulture: function(d) {
        NProgress.start();
        return $http.post(_url + "/recolteadate/ByCulture/", d);
      },
      getRecolteByVariete: function(d) {
        NProgress.start();
        return $http.post(_url + "/recolteadate/ByVariete/", d);
      }
    };
  });