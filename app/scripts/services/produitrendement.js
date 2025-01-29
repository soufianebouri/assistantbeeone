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
      byvariete: function(data) {
        NProgress.start();
        return $http.post(_url + "/produitrendement/byvariete", data);
      },
      getlast: function() {
        NProgress.start();
        return $http.post(_url + "/produitrendement/getlast");
      },
      getall: function() {
        NProgress.start();
        return $http.post(_url + "/produitrendement/getall");
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/produitrendement/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/produitrendement/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/produitrendement/delete", data);
      }
    };
  });