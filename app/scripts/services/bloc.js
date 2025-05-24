'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.bloc
 * @description
 * # bloc
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Bloc', function($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/bloc/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/bloc/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/bloc/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/bloc/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/bloc/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/bloc/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/bloc/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/bloc/getbyMultiferme", data);
      }
    };
  });
