'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.recoltepollen
 * @description
 * # recoltepollen
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('recoltepollen', function($http, _url) {
    return {
      getRecoltePollen: function(data) {
        NProgress.start();
        return $http.post(_url + "/recoltepollen/getrecoltepollen", data);
      },
      getRecoltePollenMap: function(data) {
        NProgress.start();
        return $http.post(_url + "/recoltepollen/getrecoltepollenformap", data);
      },
      getRecoltePollenParParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/recoltepollen/getrecoltepollenparparcelle", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/recoltepollen/delete", data);
      }
    };
  });