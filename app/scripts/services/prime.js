'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.prime
 * @description
 * # prime
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('prime', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/prime/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/prime/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/prime/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/prime/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/prime/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/prime/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/prime/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/prime/getbyMultiferme", data);
      }
    };
  });
