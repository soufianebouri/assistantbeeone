'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.familleculture
 * @description
 * # familleculture
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')

  .factory('familleculture', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getFamilleCulture: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleCulture/getfamilleculture", data);
      },
      getAllfamilleculture: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleCulture/getAllfamilleculture", data);
      },
      getFamilleCultureByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleCulture/getfamilleculturebyid", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleCulture/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleCulture/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/familleCulture/delete", data);
      }
    };
  });
