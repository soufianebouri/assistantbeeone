'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.qualiteStade
 * @description
 * # qualiteStade
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('qualiteStade', function($http, _url) {
    return {
      pushQualiteStade: function(baseUrl, data) {
        return $http.post(baseUrl + "/qualite_stade/create", data);
      },
      getQualiteStade: function(baseUrl) {
        return $http.get(baseUrl + "/qualite_stade");
      },
      deleteQualiteStade: function(baseUrl, data) {
        return $http.post(baseUrl + "/qualite_stade/delete", data);
      },
      updateQualiteStade: function(baseUrl, data) {
        return $http.post(baseUrl + "/qualite_stade/update", data);
      },
      getAll: function() {
        return $http.get(_url + "/qualite_stade");
      },
    };
  });