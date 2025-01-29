'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.parametrespaie
 * @description
 * # parametrespaie
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('parametrespaie', function($http, _url) {
    return {
      getParametresPaie: function() {
        return $http.get(_url + "/parametres_paie");
      }
    };
  });