'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.realisationtraitementphytosanitaire
 * @description
 * # realisationtraitementphytosanitaire
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('realisationtraitementphytosanitaire', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/realisationtraitementphytosanitaire");
      },
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/filtre", data);
      },
      getByFiltreFiche: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/fichesdesuividetraitementsphytosanitaire", data);
      },
      getRefTraitement: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/getreftraitement", data);
      },
      getByFiltreMap: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/realisationtraitementsphytosanitairemap", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/delete", data);
      },
      getAllOrdres: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/getAllOrdres", data);
      },
      getAllLieuElimination: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/getAllLieuElimination", data);
      },
      getParcelleByOrdre: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/getParcelleByOrdre", data);
      },
      getProduitByOrdre: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/getProduitByOrdre", data);
      },
      getAttelageByOrdre: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/getAttelageByOrdre", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisationtraitementphytosanitaire/createweb", data);
      }
    };
  });