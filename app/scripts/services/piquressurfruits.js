'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.piquressurfruits
 * @description
 * # piquressurfruits
 * Service in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('piquressurfruits', function($http, _url) {
    return {
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/piquressurfruits/filtre", data);
      },
      getByFiltreFiche: function(data) {
        NProgress.start();
        return $http.post(_url + "/piquressurfruits/filtrefiche", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/piquressurfruits/delete", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/piquressurfruits/update", data);
      }
    };
  });