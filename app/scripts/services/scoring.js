'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.scoring
 * @description
 * # scoring
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('scoring', function($http, _url) {
    return {
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/create", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/delete", data);
      },
      get_scoring: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_scoring", data);
      },
      get_scoring_parcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_scoring_parcelle", data);
      },
      get_scoring_cible: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_scoring_cible", data);
      },
      get_scoring_profil_calibre: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_scoring_profil_calibre", data);
      },
      get_scoring_coloration: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_scoring_coloration", data);
      },
      get_scoring_profil_calibre_poucentage: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_scoring_profil_calibre_poucentage", data);
      },
      getdatafamillecibleonlyforedit: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/getdatafamillecibleonlyforedit", data);
      },
      edit: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/edit", data);
      },
      get_for_etat: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_for_etat", data);
      },
      get_for_etat_calibre: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_for_etat_calibre", data);
      },
      get_for_etat_scoring_calibre: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_for_etat_scoring_calibre", data);
      },
      get_for_etat_cible: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_for_etat_cible", data);
      },
      get_for_etat_scoring_cible: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_for_etat_scoring_cible", data);
      },
      get_for_etat_coloration: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_for_etat_coloration", data);
      },
      get_for_etat_scoring_coloration: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_for_etat_scoring_coloration", data);
      },
      get_for_etat_scoring_estimation: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_for_etat_scoring_estimation", data);
      },
      get_scoring_profil_calibre_prevision: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_scoring_profil_calibre_prevision", data);
      },
      get_scoring_profil_calibre_poucentage_prevision: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_scoring_profil_calibre_poucentage_prevision", data);
      },
      get_distincted_calibre: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_distincted_calibre", data);
      },
      get_data_from_profile_profile: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/get_data_from_profile_profile", data);
      },
      clone_data: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/clone_data", data);
      },
      adjust_calibres: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/adjust_calibres", data);
      },
      scoring_size: function(data) {
        NProgress.start();
        return $http.post(_url + "/scoring/scoring_size", data);
      }
    };
  });