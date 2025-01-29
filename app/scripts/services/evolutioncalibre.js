'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.EvolutionCalibre
 * @description
 * # EvolutionCalibre
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('EvolutionCalibre', function($http, _url) {
    return {
      getEvolutionCalibre: function(d) {
        NProgress.start();
        return $http.post(_url + "/evolutionCalibre/getSomeProps", d);
      }
    };
  });