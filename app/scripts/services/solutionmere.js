'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.solutionmere
 * @description
 * # solutionmere
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('solutionmere', function($http, _url) {
    return {
      getSolutionMere: function(data) {
        return $http.post(_url + "/solution_mere/getSolutionMere", data);
      },
      getSolutionMereEngrais: function(data) {
        return $http.post(_url + "/solution_mere/getSolutionMereEngrais", data);
      },
      getSolutionMereEngraisForFertigation: function(data) {
        return $http.post(_url + "/solution_mere/getSolutionMereEngraisForFertigation", data);
      },
      getSolutionMereByFerme: function(data) {
        return $http.post(_url + "/solution_mere/getSolutionMereByFerme", data);
      },
      create: function(data) {
        return $http.post(_url + "/solution_mere/create", data);
      },
      update: function(data) {
        return $http.post(_url + "/solution_mere/update", data);
      },
      delete: function(data) {
        return $http.post(_url + "/solution_mere/delete", data);
      },
      getlastRefSolutionMere: function(data) {
        return $http.post(_url + "/solution_mere/getlastRefSolutionMere", data);
      }
    };
  });