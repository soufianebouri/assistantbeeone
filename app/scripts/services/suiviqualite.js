'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.suiviqualite
 * @description
 * # suiviqualite
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('suiviqualite', function($http, _url) {
    return {
      getlastProduct: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviqualite/getlastProduct", data);
      }
    };
  });