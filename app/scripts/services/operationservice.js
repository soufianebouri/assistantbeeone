'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.OperationService
 * @description
 * # OperationService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('OperationService', function($http) {
    return {
      pushOperation: function(baseUrl, data) {
        return $http.post(baseUrl + "/operations/create", data);
      },
      getOperation: function(baseUrl) {
        return $http.get(baseUrl + "/operations");
      },
      deleteOperation: function(baseUrl, data) {
        return $http.post(baseUrl + "/operations/delete", data);
      },
      updateOperation: function(baseUrl, data) {
        return $http.post(baseUrl + "/operations/update", data);
      },
      getOperationByFerme: function(baseUrl, data) {
        return $http.get(baseUrl + "/operations/" + data);
      },
      getlastOperation: function(baseUrl) {
        return $http.post(baseUrl + "/operations/getlast");
      }
    };
  });