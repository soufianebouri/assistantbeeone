'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.comptageArbre
 * @description
 * # comptageArbre
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('comptageArbre', function($http, _url) {
    return {
      getCompageArbre: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getSomeProps", d);
      },
      getForPivot: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getforpivot", d);
      },
      getformap: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getformap", d);
      },
      delete: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/delete", d);
      },
      getformapbyparcelle: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getformapbyparcelle", d);
      },
      getformapnbrArbreCompte: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getformapnbrArbreCompte", d);
      },
      getformapnbrElementCompte: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getformapnbrElementCompte", d);
      },
      getformapAllParcelles: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getformapAllParcelles", d);
      },
      getformapSumElementCompte: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getformapSumElementCompte", d);
      },
      getURLALLPropsByFiltre: function() {
        NProgress.start();
        return _url + "/comptageArbre/getALLPropsByFiltre";
      },
      getURLALLPropsByFiltreForDatatable: function() {
        NProgress.start();
        return _url + "/comptageArbre/getSomeProps";
      },
      getforEtatByArbre: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getforEtatByArbre", d);
      },
      updateweb: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/updateweb", d);
      },
      getforEtat_nombre_Arbre: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getforEtat_nombre_Arbre", d);
      },
      getyearplant_arbre: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptageArbre/getyearplant_arbre", d);
      }
    };
  });