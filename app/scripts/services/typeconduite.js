'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.typeconduite
 * @description
 * # typeconduite
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('typeconduite', function($http, _url) {
    return {
      getall: function() {
        NProgress.start();
        return $http.post(_url + "/typeconduite/getall");
      }
    };
  });