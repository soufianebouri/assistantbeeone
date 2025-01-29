'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ChutePhysiologique
 * @description
 * # ChutePhysiologique
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ChutePhysiologique', function(_url, $http) {
    return {
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_fruits/create", data);
      },
      getAllChuteFruits: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_fruits/getAllChuteFruits", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_fruits/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_fruits/delete", data);
      },
      getChuteFruits_forgraph: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_fruits/getChuteFruits_forgraph", data);
      },
      getlast_datebyparcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_fruits/getlast_datebyparcelle", data);
      },
      getChuteFruits_forSynt: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_fruits/getChuteFruits_forSynt", data);
      },
      getObservations_forSynt: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_fruits/getObservations_forSynt", data);
      },
      createrameau: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_rameaux/create", data);
      },
      getAllChuteRameau: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_rameaux/getAllChuteRameaux", data);
      },
      getChuteRameaux_fruitByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_rameaux/getChuteRameaux_fruitByID", data);
      },
      updaterameau: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_rameaux/update", data);
      },
      deleterameau: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_rameaux/delete", data);
      },
      getAllChuteRameaux_etat: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_rameaux/getAllChuteRameaux_etat", data);
      },
      updateALLCumul_byfarm: function(data) {
        NProgress.start();
        return $http.post(_url + "/chute_fruits/updateALLCumul_byfarm", data);
      }
    };
  });