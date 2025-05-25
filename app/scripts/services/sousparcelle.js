'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.sousparcelle
 * @description
 * # sousparcelle
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('sousparcelle', function($http, _url) {
    return {
      byparcellephysique: function(data) {
        NProgress.start();
        return $http.post(_url + "/sousparcelle/byparcellephysique", data);
      },
      byferme: function(data) {
        NProgress.start();
        return $http.post(_url + "/sousparcelle/byferme", data);
      },
      get_all: function() {
        return $http.post(_url + "/sousparcelle/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/sousparcelle/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/sousparcelle/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/sousparcelle/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/sousparcelle/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/sousparcelle/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/sousparcelle/getbyferme", data);
      },
      getbyMultiferme: function(data) {
        return $http.post(_url + "/sousparcelle/getbyMultiferme", data);
      }
    };
  });
