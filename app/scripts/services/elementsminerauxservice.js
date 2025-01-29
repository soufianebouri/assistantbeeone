'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ElementsMinerauxService
 * @description
 * # ElementsMinerauxService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ElementsMinerauxService', function($http) {
    return {
      pushEelem: function(baseUrl, data) {
        return $http.post(baseUrl + "/elements_mineraux/create", data);
      },
      getEelem: function(baseUrl) {
        return $http.get(baseUrl + "/elements_mineraux/list");
      },
      deleteEelem: function(baseUrl, data) {
        return $http.post(baseUrl + "/elements_mineraux/delete", data);
      },
      updateEelem: function(baseUrl, data) {
        return $http.post(baseUrl + "/elements_mineraux/update", data);
      }
    };
  });