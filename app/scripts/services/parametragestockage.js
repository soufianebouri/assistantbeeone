'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.parametragestockage
 * @description
 * # parametragestockage
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('parametragestockage', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/parametragestockage");
      }
    };
  });