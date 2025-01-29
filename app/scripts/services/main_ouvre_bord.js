'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.mainOuvreBord
 * @description
 * # mainOuvreBord
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('mainOuvreBord', function($http,_url) {
    return {
      getEffectif: function(d) {
        return $http.post(_url + "/main_oeuvre_bord/effectif",d);
      },
      getIndicateur: function(d) {
        return $http.post(_url + "/main_oeuvre_bord/indicateur",d);
      },
      getTopOperation: function(d) {
        return $http.post(_url + "/main_oeuvre_bord/top_operation",d);
      },
      getMeilleursOuvriers: function(d) {
        return $http.post(_url + "/main_oeuvre_bord/meilleurs_ouvriers",d);
      }
    };
  });
