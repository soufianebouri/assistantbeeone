'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.declarationrecolte
 * @description
 * # declarationrecolte
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('declarationrecolte', function($http, _url) {
    return {
      getAllParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/declarationrecolte/getAllParcelle/", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/declarationrecolte/create/", data);
      },
      getbyFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/declarationrecolte/getbyFiltre/", data);
      },
      getDetailsByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/declarationrecolte/getDetailsByID/", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/declarationrecolte/update/", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/declarationrecolte/delete/", data);
      },
      getforDetailsByLivraisonID: function(data) {
        NProgress.start();
        return $http.post(_url + "/declarationrecolte/getforDetailsByLivraisonID/", data);
      }
    };
  });