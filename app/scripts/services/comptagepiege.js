'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ComptagePiege
 * @description
 * # ComptagePiege
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ComptagePiege', function($http, _url) {
    return {
      getComptagePiege: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptagePiege/getSomeParams", d);
      },
      getComptagePiegeFiche: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptagePiege/getfiche", d);
      },
      getComptagePiegeFicheProfil: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptagePiege/getprofilforfiche", d);
      },
      delete: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptagePiege/delete", d);
      },
      update: function(d) {
        NProgress.start();
        return $http.post(_url + "/comptagePiege/update", d);
      }
    };
  });