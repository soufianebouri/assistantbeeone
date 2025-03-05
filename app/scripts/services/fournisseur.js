'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.Fournisseur
 * @description
 * # Fournisseur
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Fournisseur', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/fournisseur/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/fournisseur/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/fournisseur/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/fournisseur/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/fournisseur/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/fournisseur/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/fournisseur/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/fournisseur/getbyMultiferme", data);
      }
    };
  });
