'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.productionRealisee
 * @description
 * # productionRealisee
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('productionRealisee', function($http, _url, $translatePartialLoader, $translate, $window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getProductionRealisee: function() {
        return $http.get(_url + "/production_realisee/");
      },
      createPrdocutionRealisee: function(data) {
        return $http.post(_url + "/production_realisee/", data);
      },
      createPrdocutionRealiseegroup: function(data) {
        return $http.post(_url + "/production_realisee/group", data);
      },
    };
  });