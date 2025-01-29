'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.operationdesemis
 * @description
 * # operationdesemis
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('operationdesemis', function($http, _url) {
    return {
      byfiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/operationdesemis/byfiltre", data);
      },
      getParcelleSemis: function(data) {
        NProgress.start();
        return $http.post(_url + "/operationdesemis/getParcelleSemis", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/operationdesemis/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/operationdesemis/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/operationdesemis/delete", data);
      }
    };
  });