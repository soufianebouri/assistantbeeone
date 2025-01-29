'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.observationphyto
 * @description
 * # observationphyto
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('observationphyto', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/observationphyto");
      },
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/observationphyto/filtre", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/observationphyto/delete", data);
      },
      getlastRef: function(data) {
        NProgress.start();
        return $http.post(_url + "/observationphyto/getlastRef", data);
      },
      getALLCible: function(data) {
        NProgress.start();
        return $http.post(_url + "/observationphyto/getALLCible", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/observationphyto/createweb", data);
      },
      getParcellesByObservation: function(data) {
        NProgress.start();
        return $http.post(_url + "/observationphyto/getParcellesByObservation", data);
      },
      updateWeb: function(data) {
        NProgress.start();
        return $http.post(_url + "/observationphyto/updateWeb", data);
      },
      getParcelleDetailsByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/observationphyto/getParcelleDetailsByID", data);
      }
    };
  });