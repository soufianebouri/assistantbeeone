'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.profilProduction
 * @description
 * # profilProduction
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('profilProduction', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/profil_production/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/profil_production/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/profil_production/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/profil_production/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/profil_production/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/profil_production/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/profil_production/getbyferme", data);
      },
      getUnites: function(data) {
        return $http.post(_url + "/profil_production/getUnites", data);
      },
      getbymultiferme: function(data) {
        return $http.post(_url + "/profil_production/getbymultiferme", data);
      },
      getall_min: function(data) {
        return $http.post(_url + "/profil_production/getall_min", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/profil_production/getbyferme", data);
      }
    };
  });
