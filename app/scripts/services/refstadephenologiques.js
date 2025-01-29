'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.refstadephenologiques
 * @description
 * # refstadephenologiques
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('refstadephenologiques', function($http, _url) {
    return {
      getAllStadePhenologique: function() {
        NProgress.start();
        return $http.get(_url + "/stade_phenologique/");
      },
      AddStadePhenologique: function(data) {
        NProgress.start();
        return $http.post(_url + "/stade_phenologique/addstadephenologique/", data);
      },
      EditStadePhenologique: function(data) {
        NProgress.start();
        return $http.post(_url + "/stade_phenologique/editstadephenologique/", data);
      },
      DeleteStadePhenologique: function(data) {
        NProgress.start();
        return $http.post(_url + "/stade_phenologique/deletestadephenologique/", data);
      },
      getAllStadePhenologiqueByCulture: function(data) {
        NProgress.start();
        return $http.post(_url + "/stade_phenologique/listByCulture/", data);
      }
    };
  });