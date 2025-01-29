'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.classifications
 * @description
 * # classifications
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('classifications', function ($http, _url) {
    return {
      createweb: function(data) {
        return $http.post(_url + "/classifications/createweb", data);
      },
      get_all: function() {
        return $http.post(_url + "/classifications/get_all");
      },
      delete: function() {
        return $http.post(_url + "/classifications/delete");
      },
      get_all_transformed: function() {
        return $http.post(_url + "/classifications/get_all_transformed");
      },
      update: function(data) {
        return $http.post(_url + "/classifications/update", data);
      }
    };
  });
