'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.familleOperation
 * @description
 * # familleOperation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('familleOperation', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/famille_operation/get_all");
      }
    };
  });
