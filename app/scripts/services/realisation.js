'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.realisation
 * @description
 * # realisation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('realisation', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/realisation");
      },
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/realisation/filtre", data);
      },
      getAllDataByDate: function(data) {
        return $http.post(_url + "/realisation/getAllDataByDate", data);
      },
      getFert_EngraisFert_sectByFert: function(data) {
        return $http.post(_url + "/realisation/getFert_EngraisFert_sectByFert", data);
      },
      getUndoneFertilisation: function(data) {
        return $http.post(_url + "/realisation/getUndoneFertilisation", data);
      },
      createwebsimple: function(data) {
        return $http.post(_url + "/realisation/createwebsimple", data);
      },
      getFert_AffByID: function(data) {
        return $http.post(_url + "/realisation/getFert_AffByID", data);
      },
      updatewebsimple: function(data) {
        return $http.post(_url + "/realisation/updatewebsimple", data);
      },
      delete: function(data) {
        return $http.post(_url + "/realisation/delete", data);
      },
      getAllSMByID: function(data) {
        return $http.post(_url + "/realisation/getAllSMByID", data);
      },
      getFertilisationSolutionByID: function(data) {
        return $http.post(_url + "/realisation/getFertilisationSolutionByID", data);
      },
      createwebsimplefertigation: function(data) {
        return $http.post(_url + "/realisation/createwebsimplefertigation", data);
      },
      updatewebsimplefertigation: function(data) {
        return $http.post(_url + "/realisation/updatewebsimplefertigation", data);
      },
    };
  });