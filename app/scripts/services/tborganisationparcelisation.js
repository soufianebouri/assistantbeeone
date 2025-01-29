'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.tborganisationparcelisation
 * @description
 * # tborganisationparcelisation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('tborganisationparcelisation', function($http, _url) {
    return {
      repartitionbyvariete: function(d) {
        NProgress.start();
        return $http.post(_url + "/tborganisationparcelisation/repartitionbyvariete/", d);
      },
      repartitionbyPortegreffe: function(d) {
        NProgress.start();
        return $http.post(_url + "/tborganisationparcelisation/repartitionbyPortegreffe/", d);
      },
      repartitionbyAge: function(d) {
        NProgress.start();
        return $http.post(_url + "/tborganisationparcelisation/repartitionbyAge/", d);
      },
      repartitionbyRegion: function(d) {
        NProgress.start();
        return $http.post(_url + "/tborganisationparcelisation/repartitionbyRegion/", d);
      },
      repartitionbyBusinessunit: function(d) {
        NProgress.start();
        return $http.post(_url + "/tborganisationparcelisation/repartitionbyBusinessunit/", d);
      },
      getFermesForMap: function(d) {
        NProgress.start();
        return $http.post(_url + "/tborganisationparcelisation/getFermesForMap/", d);
      },
      getParcelleForMap: function(d) {
        NProgress.start();
        return $http.post(_url + "/tborganisationparcelisation/getParcelleForMap/", d);
      },
      getsupByfiltre: function(d) {
        NProgress.start();
        return $http.post(_url + "/tborganisationparcelisation/getsupByfiltre/", d);
      }
    };
  });