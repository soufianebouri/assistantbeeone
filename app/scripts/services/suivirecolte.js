'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.suivirecolte
 * @description
 * # suivirecolte
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('suivirecolte', function($http, _url) {
    return {
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_pointage_recolte/filtre", data);
      },
      getByPersonnel: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_pointage_recolte/filtre/getpersonnel", data);
      },
      showCalibre: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_pointage_recolte/filtre/getallcalibre/getcalibre", data);
      },
      showParcelleById: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_pointage_recolte/filtre/parcelle/getparcelle/parcellebyid", data);
      },
      showParcelleByCalibre: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_pointage_recolte/filtre/parcelle/getparcelle/parcellebyid/ByCalibre", data);
      }
    };
  });