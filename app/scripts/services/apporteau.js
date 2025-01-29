'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ApportEau
 * @description
 * # ApportEau
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ApportEau', function($http, _url) {
    return {
      getApportEau: function(data) {
        return $http.post(_url + "/apportEau/someParamsApportEau", data);
      },
      getOrderNumber: function() {
        return $http.get(_url + "/apportEau/getOrderNumber");
      },
      getModeIrrigation: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getModeIrrigation", data);
      },
      getApportAvancee: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getApportAvancee", data);
      },
      getApportEtatRealisation: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getApportEtatRealisation", data);
      },
      getAverageReleveClimatiqueEO: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getAverageReleveClimatiqueEO", data);
      },
      getSyntheseApportEau: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getSyntheseApportEau", data);
      },
      getBilanConsomationByParcel: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getDataBilanConsomation", data);
      },
      getParcelBilanConsomation: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getParcelBilanConsomation", data);
      },
      getDataGroupBilanConsomation: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getDataGroupBilanConsomation", data);
      },
      getGroupBilanConsomation: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getGroupBilanConsomation", data);
      },
      getVarieteBilanConsomation: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getVarieteBilanConsomation", data);
      },
      getDataGroupBilanConsomation_Mois: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getDataGroupBilanConsomation_Mois", data);
      },
      getVarieteBilanConsomation_Mois: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getVarieteBilanConsomation_Mois", data);
      },
      getDataParcelBilanConsomation_Mois: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getDataParcelBilanConsomation_Mois", data);
      },
      getApportsEngrais: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/apports_engrais", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/delete", data);
      },
      bilanconsomationByDateFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/bilanconsomationByDateFerme", data);
      },
      getlastRefAvancer: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getlastRefAvancer", data);
      },
      createWeb: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/createWeb", data);
      },
      getSecteurApporteau: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getSecteurApporteau", data);
      },
      getSousParcelleApporteau: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getSousParcelleApporteau", data);
      },
      updateWeb: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/updateWeb", data);
      },
      getlastRefSimple: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getlastRefSimple", data);
      },
      createWebSimple: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/createWebSimple", data);
      },
      getParcelleCulturalleApporteau: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/getParcelleCulturalleApporteau", data);
      },
      updateWebSimple: function(data) {
        NProgress.start();
        return $http.post(_url + "/apportEau/updateWebSimple", data);
      }
    };
  });