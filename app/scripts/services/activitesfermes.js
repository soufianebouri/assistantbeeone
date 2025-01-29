'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.activitesfermes
 * @description
 * # activitesfermes
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('activitesfermes', function($http, _url) {
    return {
      getAll: function() {
        return $http.get(_url + "/activites_fermes/");
      }
    };
  });