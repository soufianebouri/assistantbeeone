'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.calibre
 * @description
 * # calibre
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('calibre', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/calibre/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/calibre/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/calibre/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/calibre/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/calibre/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/calibre/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/calibre/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/calibre/getbyMultiferme", data);
      }
    };
  });
