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
      getProduitByFermeCategorie: function(data) {
        NProgress.start();
        return $http.post(_url + "/produit/getProduitByFermeCategorie", data);
      }
    };
  });