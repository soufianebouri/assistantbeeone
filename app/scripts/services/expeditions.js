'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.expeditions
 * @description
 * # expeditions
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('expeditions', function($http, _url) {
    return {
      showExpedition: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/showexpedition", data);
      },
      showCaisse: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/showcaisse", data);
      },
      showByGroupeOperationnel: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/showByGroupeOperationnel", data);
      },
      showParcelleCulturale: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/showParcelleCulturale", data);
      },
      showParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/showparcelle", data);
      },
      showCodeExterne: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/showCodeExterne", data);
      },
      showExpeditionForPivot: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/showEepeditionforpivot", data);
      },
      showFax: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/showFax", data);
      },
      getallClient: function(data) {
        console.log("URL",_url);
        NProgress.start();
        return $http.post(_url + "/expedition/getallClient", data);
      },
      getMaxRef: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/getMaxRef", data);
      },
      getAllParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/getAllParcelle", data);
      },
      getAllMarque: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/getAllMarque", data);
      },
      createmarque: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/createmarque", data);
      },
      createexpedition: function(data) {
        console.log(_url)
        NProgress.start();
        return $http.post(_url + "/expedition/createexpedition", data);
      },
      deleteexpedition: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/deleteexpedition", data);
      },
      getlasttraitement: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/getlasttraitement", data);
      },
      gettraitementbyexp: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/gettraitementbyexp", data);
      },
      updateexpedition: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/updateexpedition", data);
      },

      getTracabilite: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/show_for_code_barre_tracabilite", data);
      },

      getTraitement: function(data) {
        NProgress.start();
        return $http.post(_url + "/expedition/show_for_code_barre_traitement", data);
      }


    };
  });