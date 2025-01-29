'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.GroupeOperationnel
 * @description
 * # GroupeOperationnel
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('GroupeOperationnel', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getGroupeOperationnelByFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupescultural/getGroupeOperationnelByFerme", data);
      },
      getGroupeOperationnelByProduitFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupescultural/getGroupeOperationnelByProduitFerme", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupescultural/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupescultural/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupescultural/delete", data);
      }
    };
  });
