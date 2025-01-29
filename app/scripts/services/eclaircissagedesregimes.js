'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.eclaircissagedesregimes
 * @description
 * # eclaircissagedesregimes
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('eclaircissagedesregimes', function($http, _url) {
    return {
      getEclaircissageDesRegimes: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/geteclaircissagedesregimes", data);
      },
      getformap: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/getformap", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/delete", data);
      },
      getparcelles: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/getparcelles", data);
      },
      getarbres: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/getarbres", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/createweb", data);
      },
      getOrdre: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/getOrdre", data);
      },
      getObs_Comptage_Arbre_OrdreByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/getObs_Comptage_Arbre_OrdreByID", data);
      },
      deleteOrdre: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/deleteOrdre", data);
      },
      getObs_Comptage_Arbre_Ordre: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/getObs_Comptage_Arbre_Ordre", data);
      },
      getDistinctedParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/getDistinctedParcelle", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/eclaircissagedesregimes/updateweb", data);
      }
    };
  });