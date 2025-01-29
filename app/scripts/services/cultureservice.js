'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.cultureService
 * @description
 * # cultureService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('cultureService', function($http, Upload, _url) {
    return {
      ByFermeIfExist: function(d) {
        return $http.post(_url + "/cultures/ByFermeIfExist", d);
      },
      getFamilleCulture: function(baseUrl) {
        return $http.get(baseUrl + "/familleCulture/listID");
      },
      pushDataCulture: function(baseUrl, data) {
        return $http.post(baseUrl + "/cultures/", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/cultures/create", data);
      },
      GetFullByFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/cultures/FullByFerme", data);
      },
      getCulture: function(baseUrl) {
        return $http.get(baseUrl + "/cultures");
      },
      getCultureByFerme: function(f) {
        return $http.get(_url + "/cultures/ByFerme/" + f);
      },
      getCultureIdName: function(baseUrl) {
        return $http.get(baseUrl + "/cultures/listID");
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/cultures/delete", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/cultures/update", data);
      },
      getCultureFiltrer: function(data) {
        NProgress.start();
        return $http.post(_url + "/cultures/getCultureFiltrer", data);
      },
      byFamille: function(data) {
        NProgress.start();
        return $http.post(_url + "/cultures/byFamille", data);
      },
      ByFermeEncours: function(data) {
        NProgress.start();
        return $http.post(_url + "/cultures/ByFermeEncours", data);
      }
    };
  });