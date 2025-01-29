'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.StadePheno
 * @description
 * # StadePheno
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('StadePheno', function($http, _url) {
    return {
      getStadePheno: function(data) {
        NProgress.start();
        return $http.post(_url + "/autreStade/getSomeProps", data);
      },
      CreateStadePheno: function(data) {
        NProgress.start();
        return $http.post(_url + "/autreStade/createstadepheno", data);
      },
      EditStadePheno: function(data) {
        NProgress.start();
        return $http.post(_url + "/autreStade/editstadepheno", data);
      },
      DeleteStadePheno: function(data) {
        NProgress.start();
        return $http.post(_url + "/autreStade/deletestadepheno", data);
      },
      diagrammegantt: function(data) {
        NProgress.start();
        return $http.post(_url + "/autreStade/diagrammegantt", data);
      }
    };
  });