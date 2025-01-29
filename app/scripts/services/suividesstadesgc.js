'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.suividesstadesgc
 * @description
 * # suividesstadesgc
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('suividesstadesgc', function($http, _url) {
    return {
      getbyfiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/suividesstadesgc/getbyfiltre", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/suividesstadesgc/delete", data);
      },
      getdetailsByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/suividesstadesgc/getdetailsByID", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/suividesstadesgc/update", data);
      }
    };
  });