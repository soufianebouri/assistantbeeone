'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.FermeService
 * @description
 * # FermeService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('FermeService', function($http,_url) {
    return {
      getFermesByIdName: function(baseUrl) {
        return $http.get(baseUrl + "/fermes/fermeIdName");
      },
      getFermeById: function(d) {
        return $http.get(_url + "/fermes/"+d);
      },
      bySociete: function(d) {
        return $http.post(_url + "/fermes/bySociete/",d);
      },
      byTypeVariete: function(d) {
        return $http.post(_url + "/fermes/byTypeVariete/",d);
      },      
    };
  });