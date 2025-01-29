'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ValidationAutoObservation
 * @description
 * # ValidationAutoObservation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ValidationAutoObservation', function($http) {
    return {
      pushValidationAutoObservation: function(baseUrl, data) {
        return $http.post(baseUrl + "/validation_automatique/create", data);
      },
      getValidationAutoObservation: function(baseUrl) {
        return $http.get(baseUrl + "/validation_automatique");
      },
      deleteValidationAutoObservation: function(baseUrl, data) {
        return $http.post(baseUrl + "/validation_automatique/delete", data);
      },
      updateValidationAutoObservation: function(baseUrl, data) {
        return $http.post(baseUrl + "/validation_automatique/update", data);
      }
    };
  });