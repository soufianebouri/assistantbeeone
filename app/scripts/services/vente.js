'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.vente
 * @description
 * # vente
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('vente', function($http, _url) {
    return {
      getallVente: function(data) {
        NProgress.start();
        return $http.post(_url + "/vente/getallVente", data);
      },
      getallClient: function(data) {
        NProgress.start();
        return $http.post(_url + "/vente/getallClient", data);
      },
      getallExpedition: function(data) {
        NProgress.start();
        return $http.post(_url + "/vente/getallExpedition", data);
      },
      getMaxRef: function(data) {
        NProgress.start();
        return $http.post(_url + "/vente/getMaxRef", data);
      },
      getAllVarieteProduit: function(data) {
        NProgress.start();
        return $http.post(_url + "/vente/getAllVarieteProduit", data);
      },
      getAllCaisses: function(data) {
        NProgress.start();
        return $http.post(_url + "/vente/getAllCaisses", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/vente/createweb", data);
      },
      deleteweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/vente/deleteweb", data);
      },
      getVenteDetails: function(data) {
        NProgress.start();
        return $http.post(_url + "/vente/getVenteDetails", data);
      }
    };
  });