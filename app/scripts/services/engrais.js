'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.engrais
 * @description
 * # engrais
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('engrais', function($http, _url) {
    return {
      showbyferme: function(d) {
        NProgress.start();
        return $http.post(_url + "/engrais/showbyferme", d);
      },
      showbyfermeDateForSolde: function(d) {
        NProgress.start();
        return $http.post(_url + "/engrais/showbyfermeDateForSolde", d);
      }
    };
  });