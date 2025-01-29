'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.IntensiteFleur
 * @description
 * # IntensiteFleur
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('IntensiteFleur', function($http, _url) {
    return {
      getIntensiteFleur: function(data) {
        NProgress.start();
        return $http.post(_url + "/intensiteFleure/getSomeProps", data);
      },
      getParcelWithOrientation: function(data) {
        NProgress.start();
        return $http.post(_url + "/intensiteFleure/getParcelWithOrientation", data);
      },
      getParcelWithArbre: function(data) {
        NProgress.start();
        return $http.post(_url + "/intensiteFleure/getParcelWithArbre", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/intensiteFleure/delete", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/intensiteFleure/update", data);
      }
    };
  });