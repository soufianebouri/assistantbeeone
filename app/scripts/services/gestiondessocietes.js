'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.gestiondessocietes
 * @description
 * # gestiondessocietes
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('gestiondessocietes', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getSociete: function() {
        return $http.get(_url + "/get_societe/");
      }
    };
  });
