'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.bloc
 * @description
 * # bloc
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Bloc', function($http, _url) {
    return {
      getBlocByFarm: function(id) {
        return $http.get(_url + "/bloc/" + id);
      },
      getallbyfermeWithSup: function(data) {
        NProgress.start();
        return $http.post(_url + "/bloc/getallbyfermeWithSup", data);
      },
      getAllbyFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/bloc/getallbyferme", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/bloc/create", data);
      }
    };
  });