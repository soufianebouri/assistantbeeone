'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.comptagedesravageursSynthesesurveillance
 * @description
 * # comptagedesravageursSynthesesurveillance
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('comptagedesravageursSynthesesurveillance', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/obssynthesecomptageravageur");
      },
      getDistinctedCible: function(data) {
        NProgress.start();
        return $http.post(_url + "/obssynthesecomptageravageur/filtre/getdistinctedcible", data);
      },
      getArbreParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/obssynthesecomptageravageur/filtre/getarbreparcelle/arbreparcelle", data);
      },
      getNbrInsectes: function(data) {
        NProgress.start();
        return $http.post(_url + "/obssynthesecomptageravageur/filtre/getarbreparcellecible/arbreparcellecible/nbrinsectes", data);
      }
    };
  });