'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.depot
 * @description
 * # depot
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('depot', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/depots/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/depots/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/depots/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/depots/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/depots/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/depots/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/depots/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/depots/getbyMultiferme", data);
      }
    };
  });
