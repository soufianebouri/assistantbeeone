'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.parcelleculturalgroupeoperationnel
 * @description
 * # parcelleculturalgroupeoperationnel
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('parcelleculturalgroupeoperationnel', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getGroupeParcelleCultural: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupeparcellecultural/getgroupeparcellecultural", data);
      },
      getParcelleculturalnotGrouped: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupeparcellecultural/getparcelleculturalnotgrouped", data);
      },
      getGroupe: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupeparcellecultural/getgroupe", data);
      },
      Create: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupeparcellecultural/create", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupeparcellecultural/delete", data);
      }
    };
  });
