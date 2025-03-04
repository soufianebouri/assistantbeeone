'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.produitrendement
 * @description
 * # produitrendement
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('produitrendement', function($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/produit_rendement/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/produit_rendement/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/produit_rendement/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/produit_rendement/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/produit_rendement/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/produit_rendement/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/produit_rendement/getbyferme", data);
      },
      getUnites: function(data) {
        return $http.post(_url + "/produit_rendement/getUnites", data);
      }
    };
  });
