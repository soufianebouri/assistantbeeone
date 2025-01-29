'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.bac
 * @description
 * # bac
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('bac', function($http, _url) {
    return {
      getbyferme: function(data) {
        return $http.post(_url + "/bac/getbyferme", data);
      }
    };
  });