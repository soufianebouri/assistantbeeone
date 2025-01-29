'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.familleCible
 * @description
 * # familleCible
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('familleCible', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getall: function() {
        NProgress.start();
        return $http.post(_url + "/familleCible/getall");
      },
      create: function(d) {
        NProgress.start();
        return $http.post(_url + "/familleCible/create", d);
      },
      update: function(d) {
        NProgress.start();
        return $http.post(_url + "/familleCible/update", d);
      },
      delete: function(d) {
        NProgress.start();
        return $http.post(_url + "/familleCible/delete", d);
      }
    };
  });
