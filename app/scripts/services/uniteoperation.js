'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.uniteoperation
 * @description
 * # uniteoperation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('uniteoperation', function($http, _url, $translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getall: function(data) {
        NProgress.start();
        return $http.post(_url + "/uniteoperation/getall", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/uniteoperation/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/uniteoperation/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/uniteoperation/delete", data);
      }
    };
  });
