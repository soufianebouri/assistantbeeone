'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.getsuperficie
 * @description
 * # getsuperficie
 * Factory in the beeOneWebFrontApp.
 */

angular.module('beeOneWebFrontApp')
  .factory('getsuperficie', function($http, _url) {
    return {
      getsuperficieFromParcelleCulturalle: function(data) {
        NProgress.start();
        return $http.post(_url + "/getsuperficie/fromparcelleculturalle", data);
      },
      getsupFromParcelleCulturaleByfiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/getsuperficie/fromparcelleculturallebyfiltre", data);
      }
    };
  });