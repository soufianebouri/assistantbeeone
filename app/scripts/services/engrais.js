'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.engrais
 * @description
 * # engrais
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('engrais', function($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/engrais/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/engrais/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/engrais/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/engrais/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/engrais/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/engrais/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/engrais/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/engrais/getbyMultiferme", data);
      }
    };
  });
