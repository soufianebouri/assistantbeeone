'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.gestionprofils
 * @description
 * # gestionprofils
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('gestionprofils', function($http, _url) {
    return {
      getUsers: function() {
        return $http.get(_url + "/administration_profils");
      },
      CreateUsers: function(data) {
        return $http.post(_url + "/administration_profils", data);
      },
      UpdateUsers: function(data) {
        return $http.put(_url + "/administration_profils", data);
      },
      DeleteUsers: function(data) {
        return $http.post(_url + "/administration_profils/delete", data);
      },
      BlockerUsers: function(data) {
        return $http.post(_url + "/administration_profils/action/block", data);
      }
    };
  });