'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.uniteOperation
 * @description
 * # uniteOperation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('uniteOperation', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/unite_operation/get_all");
      }
    };
  });
