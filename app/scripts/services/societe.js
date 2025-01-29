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
      getSociete: function() {
        return $http.get(_url + "/societe_cooperatif");
      }
    };
  });