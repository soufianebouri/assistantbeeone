'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.profilsfermes
 * @description
 * # profilsfermes
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('profilsfermes', function($http, _url) {
    return {
      getProfilsFermes: function(data) {
        NProgress.start();
        return $http.post(_url + "/administration_fermesprofils/filtre", data);
      },
      Create: function(data) {
        NProgress.start();
        return $http.post(_url + "/administration_fermesprofils/create", data);
      },
      Retirer: function(data) {
        NProgress.start();
        return $http.post(_url + "/administration_fermesprofils/delete", data);
      },
      getavailibalefermes: function(data) {
        NProgress.start();
        return $http.post(_url + "/administration_fermesprofils/getavailibalefermes", data);
      }
    };
  });