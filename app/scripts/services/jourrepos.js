'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.jourrepos
 * @description
 * # jourrepos
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('jourrepos', function($http, _url) {
    return {
      getJourRepos: function(idferme) {
        return $http.get(_url + "/jourrepos/" + idferme);
      }
    };
  });