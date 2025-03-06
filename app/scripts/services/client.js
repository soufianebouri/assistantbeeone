'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.client
 * @description
 * # client
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('client', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/client/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/client/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/client/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/client/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/client/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/client/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/client/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/client/getbyMultiferme", data);
      }
    };
  });
