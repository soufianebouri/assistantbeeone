'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.multiperiodevariete
 * @description
 * # multiperiodevariete
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('multiperiodevariete', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      showvarietes: function(data) {
        NProgress.start();
        return $http.post(_url + "/prevision_multiperiodevariete/varietes", data);
      },
      showperiodes: function(data) {
        NProgress.start();
        return $http.post(_url + "/prevision_multiperiodevariete/periodes", data);
      },
      showquantite: function(data) {
        NProgress.start();
        return $http.post(_url + "/prevision_multiperiodevariete/quantites", data);
      }
    };
  });
