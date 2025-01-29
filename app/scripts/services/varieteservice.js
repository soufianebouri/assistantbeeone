'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.VarieteService
 * @description
 * # VarieteService
 * Factory in the beeOneWebFrontApp.
 */

angular.module('beeOneWebFrontApp')
  .factory('VarieteService', function($http, _url) {
    return {
      pushDataVariete: function(data) {
        NProgress.start();
        return $http.post(_url + "/varietes/", data);
      },
      getVariete: function(baseUrl) {
        return $http.get(baseUrl + "/varietes");
      },
      getVarieteByFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/varietes/byferme", data);
      },
      deleteVariete: function(data) {
        NProgress.start();
        return $http.post(_url + "/varietes/delete", data);
      },
      updateDataVariete: function(data) {
        NProgress.start();
        return $http.post(_url + "/varietes/update", data);
      },
      getNameIdVariete: function(baseUrl, data) {
        return $http.get(baseUrl + "/varietes/withNameId", data);
      },
      getVarieteByParcel: function(data) {
        return $http.post(_url + "/varietes/getVarieteByParcel", data);
      },
      getVarieteByFarm: function(data) {
        return $http.post(_url + "/varietes/getVarieteByFarm", data);
      },
      getVarieteByFarmSociete: function(data) {
        return $http.post(_url + "/fermes_varietes/varietes", data);
      },
      showVarieteByCultureFerme: function(data) {
        return $http.post(_url + "/varietes/showByCultureFerme", data);
      },
      getVarieteByFermeGroup: function(data) {
        return $http.post(_url + "/varietes/getVarieteByFermeGroup", data);
      },
      getVarieteFiltrer: function(data) {
        NProgress.start();
        return $http.post(_url + "/varietes/getVarieteFiltrer", data);
      },
      showByFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/varietes/showByFerme", data);
      },
      ByFamilleCulture: function(data) {
        NProgress.start();
        return $http.post(_url + "/varietes/ByFamilleCulture", data);
      }
    };
  });