'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.societe
 * @description
 * # societe
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('societe', function($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/societe/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/societe/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/societe/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/societe/delete", data);
      }
    };
  });