'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.visites
 * @description
 * # visites
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('visites', function($http, _url) {
    return {
      getAllVisite: function() {
        NProgress.start();
        return $http.get(_url + "/visite/");
      },
      getAllFilter: function(data) {
        NProgress.start();
        return $http.post(_url + "/visite/getAllFilter", data);
      },
      getProfileByFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/visite/getProfileByFerme", data);
      },
      getHostPics: function() {
        NProgress.start();
        return $http.post(_url + "/visite/getHostPics");
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/visite/delete", data);
      }
    };
  });