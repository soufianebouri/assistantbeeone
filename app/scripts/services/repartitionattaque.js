'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.RepartitionAttaque
 * @description
 * # RepartitionAttaque
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('RepartitionAttaque', function($http) {
    return {
      pushRepartitionAttaque: function(baseUrl, data) {
        return $http.post(baseUrl + "/repartition_attaque/create", data);
      },
      getRepartitionAttaque: function(baseUrl) {
        return $http.get(baseUrl + "/repartition_attaque");
      },
      deleteRepartitionAttaque: function(baseUrl, data) {
        return $http.post(baseUrl + "/repartition_attaque/delete", data);
      },
      updateRepartitionAttaque: function(baseUrl, data) {
        return $http.post(baseUrl + "/repartition_attaque/update", data);
      }
    };
  });