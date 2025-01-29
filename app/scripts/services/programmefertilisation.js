'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.programmefertilisation
 * @description
 * # programmefertilisation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('programmefertilisation', function($http, _url) {
    return {
      getProgrammeFertilisation: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmefertilisation/getProgrammeFertilisation", data);
      },
      getProgrammeFertilisationEngrais: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmefertilisation/getProgrammeFertilisationEngrais", data);
      },
      getlastRefProgrammeFertilisation: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmefertilisation/getlastRefProgrammeFertilisation", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmefertilisation/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmefertilisation/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/programmefertilisation/delete", data);
      },
    };
  });