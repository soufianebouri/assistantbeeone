'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.OperationService
 * @description
 * # OperationService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('OperationService', function($http,_url) {
    return {
      get_all: function() {
        return $http.post(_url + "/operation/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/operation/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/operation/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/operation/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/operation/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/operation/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/operation/getbyferme", data);
      }
    };
  });
