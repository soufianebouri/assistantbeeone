'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.cycle
 * @description
 * # cycle
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('cycle', function($http, _url) {
    return {
      getCycle: function() {
        return $http.get(_url + "/cycle/");
      },
      getCycleByferme: function(data) {
        return $http.post(_url + "/cycle/showbyferme", data);
      },
      createCycle: function(data) {
        return $http.post(_url + "/cycle/create", data);
      },
      updateCycle: function(data) {
        return $http.post(_url + "/cycle/update", data);
      },
      deleteCycle: function(data) {
        return $http.post(_url + "/cycle/delete", data);
      },
      getbytype: function(data) {
        return $http.post(_url + "/cycle/getbytype", data);
      }
    };
  });