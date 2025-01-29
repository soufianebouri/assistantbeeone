'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.onboarding
 * @description
 * # onboarding
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
.factory('onboarding', function ($http) {
  return {
    getData: function () {
      return $http.get('') 
        .then(function (response) {
          return response.data; 
        })
        .catch(function (error) {
          console.error("Error loading JSON file:", error);
        });
    }
  };
});
