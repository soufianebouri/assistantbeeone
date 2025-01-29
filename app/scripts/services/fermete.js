'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.fermete
 * @description
 * # fermete
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('fermete', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getallPeau: function() {
        NProgress.start();
        return $http.post(_url + "/fermete/getallPeau");
      },
      getallFruit: function() {
        NProgress.start();
        return $http.post(_url + "/fermete/getallFruit");
      },
      createFruit: function(data) {
        NProgress.start();
        return $http.post(_url + "/fermete/createFruit", data);
      },
      updateFruit: function(data) {
        NProgress.start();
        return $http.post(_url + "/fermete/updateFruit", data);
      },
      deleteFruit: function(data) {
        NProgress.start();
        return $http.post(_url + "/fermete/deleteFruit", data);
      },
      createPeau: function(data) {
        NProgress.start();
        return $http.post(_url + "/fermete/createPeau", data);
      },
      updatePeau: function(data) {
        NProgress.start();
        return $http.post(_url + "/fermete/updatePeau", data);
      },
      deletePeau: function(data) {
        NProgress.start();
        return $http.post(_url + "/fermete/deletePeau", data);
      }
    };
  });
