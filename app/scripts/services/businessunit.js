'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.BusinessUnit
 * @description
 * # BusinessUnit
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('BusinessUnit', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getBusinessUnit: function(id) {
        return $http.post(_url + "/business_unit/", id);
      },
      getAllBusinessUnit: function() {
        return $http.get(_url + "/business_unit/");
      },
      getBusinessIdSociete: function() {
        return $http.get(_url + "/business_unit/getBusiness_unitWithIdSociete");
      },
      create: function(data) {
        return $http.post(_url + "/business_unit/create", data);
      },
      update: function(data) {
        return $http.post(_url + "/business_unit/update", data);
      },
      delete: function(data) {
        return $http.post(_url + "/business_unit/delete", data);
      }
    };
  });
