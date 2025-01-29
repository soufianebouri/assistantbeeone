'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.Vehicule
 * @description
 * # Vehicule
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Vehicule', function($http, _url) {
    return {
      getall: function() {
        return $http.get(_url + "/Vehicule/getall");
      }
    };
  });