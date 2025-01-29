'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.coutparoperations
 * @description
 * # coutparoperations
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('coutparoperations', function($http, _url) {
    return {
      getByFamilleCulture: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_coutparoperation/byfamilleculture", data);
      },
      getNbrPersonne: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_coutparoperation/nbrpersonne", data);
      },
      getHSdeclaree: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_coutparoperation/hsdeclare", data);
      },
      getByOperation: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_coutparoperation/byoperationfamilleculture", data);
      },
      getOperationNbrPersonne: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_coutparoperation/operationnbrpersonne", data);
      },
      getOperationHSdeclaree: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_coutparoperation/operationhsdeclare", data);
      }
    };
  });