'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.categoriepesticide
 * @description
 * # categoriepesticide
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('categoriepesticide', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getAll: function() {
        return $http.post(_url + "/categoriepesticide/getall");
      },
      create: function(data) {
        return $http.post(_url + "/categoriepesticide/create", data);
      },
      update: function(data) {
        return $http.post(_url + "/categoriepesticide/update", data);
      },
      delete: function(data) {
        return $http.post(_url + "/categoriepesticide/delete", data);
      }
    };
  });
