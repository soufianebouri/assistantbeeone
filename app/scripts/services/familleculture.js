'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.familleculture
 * @description
 * # familleculture
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')

  .factory('familleculture', function($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/famille_culture/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/famille_culture/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/famille_culture/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/famille_culture/delete", data);
      },
    };
  });
