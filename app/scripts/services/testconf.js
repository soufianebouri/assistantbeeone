'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.testConf
 * @description
 * # testConf
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('testConf', function($http, _url) {
    return {
      getDetails: function(d) {
        NProgress.start();
        return $http.post(_url + "/test_conformite_details/details", d);
      },
      getParcelles: function(d) {
        NProgress.start();
        return $http.post(_url + "/test_conformite_details/parcelle", d);
      },
      getGoutteurs: function(d) {
        NProgress.start();
        return $http.post(_url + "/test_conformite_details/goutteurs", d);
      },
      delete: function(d) {
        NProgress.start();
        return $http.post(_url + "/test_conformite_details/delete", d);
      }
    };
  });