'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.VarieteService
 * @description
 * # VarieteService
 * Factory in the beeOneWebFrontApp.
 */

angular.module('beeOneWebFrontApp')
  .factory('VarieteService', function($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/variete/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/variete/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/variete/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/variete/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/variete/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/variete/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/variete/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/variete/getbyMultiferme", data);
      }
    };
  });
