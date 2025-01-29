'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.suivimeteo
 * @description
 * # suivimeteo
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('suivimeteo', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/suivimeteo");
      },
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/suivimeteo/filtre", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/suivimeteo/delete", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suivimeteo/createweb", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suivimeteo/updateweb", data);
      }
    };
  });