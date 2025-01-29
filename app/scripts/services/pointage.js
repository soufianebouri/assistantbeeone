'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.pointage
 * @description
 * # pointage
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('pointage', function($http, _url, $rootScope) {
    return {
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_pointage/filtre", data);
      },
      getByPersonnel: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_pointage/filtre/getpersonnel", data);
      },
      getByParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_pointage/filtre/parcelle/getparcelle", data);
      },
      getByCentre: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_pointage/filtre/centre/getcentre/centrebyid", data);
      }
    };
  });