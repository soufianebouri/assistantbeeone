'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.comptagedesravageursSyntheseparculturesurveillance
 * @description
 * # comptagedesravageursSyntheseparculturesurveillance
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('comptagedesravageursSyntheseparculturesurveillance', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/obssyntheseparculturecomptageravageur");
      },
      getDistinctedCible: function(data) {
        NProgress.start();
        return $http.post(_url + "/obssyntheseparculturecomptageravageur/filtre/getdistinctedcible", data);
      },
      getArbreParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/obssyntheseparculturecomptageravageur/filtre/getarbreparcelle/arbreparcelle", data);
      },
      getNbrInsectes: function(data) {
        NProgress.start();
        return $http.post(_url + "/obssyntheseparculturecomptageravageur/filtre/getarbreparcellecible/arbreparcellecible/nbrinsectes", data);
      }
    };
  });