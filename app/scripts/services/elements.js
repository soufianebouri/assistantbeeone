'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.elements
 * @description
 * # elements
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('elements', function ($http, _url) {
    return {
      getall: function() {
        NProgress.start();
        return $http.post(_url + "/element/getall");
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/element/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/element/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/element/delete", data);
      },
      getallFormules: function() {
        NProgress.start();
        return $http.post(_url + "/element/getallFormules");
      },
      affecttoculture: function(data) {
        NProgress.start();
        return $http.post(_url + "/element/affecttoculture", data);
      },
      delete_affectation: function(data) {
        NProgress.start();
        return $http.post(_url + "/element/delete_affectation", data);
      },
      getelementculture: function(data) {
        NProgress.start();
        return $http.post(_url + "/element/getelementculture", data);
      },
      updateaffecttoculture: function(data) {
        NProgress.start();
        return $http.post(_url + "/element/updateaffecttoculture", data);
      }
    };
  });
