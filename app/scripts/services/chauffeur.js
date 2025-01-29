'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.Chauffeur
 * @description
 * # Chauffeur
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Chauffeur', function($http, _url) {
    return {
      getall: function() {
        return $http.get(_url + "/Chauffeur/getall");
      }
    };
  });