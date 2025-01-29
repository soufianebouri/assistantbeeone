'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.atatdesvariables
 * @description
 * # atatdesvariables
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('atatdesvariables', function($http, _url) {
    return {
      getEtatVariable: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_etatvariable/getetatvariable", data);
      },
      getCongerDates: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_etatvariable/getcongerdate", data);
      },
      getOperationPrincipale: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_etatvariable/getoperationprincipale", data);
      },
      getNbrJourOperation: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_etatvariable/getnbrjouroperation", data);
      },
      getNbrJourAutreOperation: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_etatvariable/getnbrjourautreoperation", data);
      },
      getNamesPrime: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_etatvariable/getnamesprime", data);
      },
      getSumPrimeByPersonnel: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_etatvariable/getsumprimebypersonnel", data);
      }
    };
  });