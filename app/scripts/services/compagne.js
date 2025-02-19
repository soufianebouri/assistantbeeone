'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.compagne
 * @description
 * # compagne
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('compagne', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/compagne/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/compagne/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/compagne/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/compagne/delete", data);
      },
    };
  });
