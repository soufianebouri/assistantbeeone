'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.periodepaie
 * @description
 * # periodepaie
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('periodepaie', function($http, _url) {
    return {
      getPeriodeEstimation: function() {
        NProgress.start();
        return $http.get(_url + "/periode_paie/all");
      },
      getPerdiodeEnCours: function() {
        NProgress.start();
        return $http.get(_url + "/periode_paie_en_cours/");
      }      
    };
  });