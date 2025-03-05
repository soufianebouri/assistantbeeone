'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.Produit
 * @description
 * # Produit
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Produit', function($http, _url) {
    return {
      get_all: function(data) {
        NProgress.start();
        return $http.post(_url + "/produit/get_all", data);
      },
      add: function(data) {
        return $http.post(_url + "/produit/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/produit/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/produit/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/produit/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/produit/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/produit/getbyferme", data);
      },
      getUnites: function(data) {
        return $http.post(_url + "/produit/getUnites", data);
      }
    };
  });
