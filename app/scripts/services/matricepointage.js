'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.matricepointage
 * @description
 * # matricepointage
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('matricepointage', function($http, _url) {
    return {
      getPersonnel: function(data) {
        NProgress.set(0.4);
        return $http.post(_url + "/mainoeuvre_matricepointage/filtre", data);
      },
      getPointage: function(data) {
        NProgress.set(0.4);
        return $http.post(_url + "/mainoeuvre_matricepointage/filtre/pointage", data);
      },
      getPersonnelConge: function(data) {
        NProgress.set(0.4);
        return $http.post(_url + "/mainoeuvre_matricepointage/filtre/personnel/conge", data);
      }
    };
  });