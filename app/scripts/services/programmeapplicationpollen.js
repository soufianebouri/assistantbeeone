'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.programmeapplicationpollen
 * @description
 * # programmeapplicationpollen
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('programmeapplicationpollen', function($http, _url) {
    return {
      getProgrammeAppPollen: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmeapplicationpollen/getprogrammeapppollen", data);
      },
      getLastRefbyferme: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmeapplicationpollen/getlastrefbyferme", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmeapplicationpollen/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmeapplicationpollen/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmeapplicationpollen/delete", data);
      },
      getparcelles: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmeapplicationpollen/getparcelles", data);
      },
      getarbres: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmeapplicationpollen/getarbres", data);
      }
    };
  });