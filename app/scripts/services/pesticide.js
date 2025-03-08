'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.pesticide
 * @description
 * # pesticide
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('pesticide', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/pesticide/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/pesticide/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/pesticide/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/pesticide/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/pesticide/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/pesticide/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/pesticide/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/pesticide/getbyMultiferme", data);
      }
    };
  });
