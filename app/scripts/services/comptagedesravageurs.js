'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.comptagedesravageurs
 * @description
 * # comptagedesravageurs
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('comptagedesravageurs', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/obscomptageravageur");
      },
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/obscomptageravageur/filtre", data);
      },
      getDistinctedCible: function(data) {
        NProgress.start();
        return $http.post(_url + "/obscomptageravageur/filtre/getdistinctedcible", data);
      },
      getArbreParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/obscomptageravageur/filtre/getarbreparcelle/arbreparcelle", data);
      },
      getNbrInsectes: function(data) {
        NProgress.start();
        return $http.post(_url + "/obscomptageravageur/filtre/getarbreparcellecible/arbreparcellecible/nbrinsectes", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/obscomptageravageur/delete", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/obscomptageravageur/update", data);
      }
    };
  });