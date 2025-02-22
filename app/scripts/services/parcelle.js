'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.parcelle
 * @description
 * # parcelle
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('parcelleCultural', function($http,_url) {
    return {
      get_all: function() {
        return $http.post(_url + "/parcelle/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/parcelle/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/parcelle/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/parcelle/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/parcelle/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/parcelle/multiadd", data);
      }
    };
  });
