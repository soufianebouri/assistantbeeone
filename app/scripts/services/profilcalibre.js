'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ProfilCalibre
 * @description
 * # ProfilCalibre
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ProfilCalibre', function($http, _url) {
    return {
      getProfilCalibre: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getSomeProps", data);
      },
      getFicheProfilCalibre: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getficheprofilcalibre", data);
      },
      getCalibreByVariete: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getCalibreByVariete", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/createweb", data);
      },
      getCalibreByProfil: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getCalibreByProfil", data);
      },
      getAllCalibreByProfil: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getAllCalibreByProfil", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/updateweb", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/delete", data);
      },
      getNbreFruitscontroleForSynthese: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getNbreFruitscontroleForSynthese", data);
      },
      getCalibreforSynthese: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getCalibreforSynthese", data);
      },
      getNbravecdiametreCalibreforSynthese: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getNbravecdiametreCalibreforSynthese", data);
      },
      getPourcentageCalibreByProfil: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getPourcentageCalibreByProfil", data);
      },
      getCalibreByProfil_Prevision: function(data, saved_prevision) {
        NProgress.start();
        return (saved_prevision) ? $http.post(_url + "/profilCalibre/getCalibreByProfil_Prevision", data) : [];
      },
      getPourcentageCalibreByProfil_Prevision: function(data, saved_prevision) {
        NProgress.start();
        return (saved_prevision) ? $http.post(_url + "/profilCalibre/getPourcentageCalibreByProfil_Prevision", data) : [];
      },
      getNbreFruitscontroleForSynthese_projection: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getNbreFruitscontroleForSynthese_projection", data);
      },
      getCalibreforSynthese_projection: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getCalibreforSynthese_projection", data);
      },
      getNbravecdiametreCalibreforSynthese_projection: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilCalibre/getNbravecdiametreCalibreforSynthese_projection", data);
      }
    };
  });