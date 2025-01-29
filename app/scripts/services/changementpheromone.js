'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.changementpheromone
 * @description
 * # changementpheromone
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('changementpheromone', function($http, _url) {
    return {
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/changementpheromone/filtre", data);
      },
      getByFiltreFiche: function(data) {
        NProgress.start();
        return $http.post(_url + "/changementpheromone/filtrefiche", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/changementpheromone/delete", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/changementpheromone/update", data);
      },
      getNumChangement: function(data) {
        NProgress.start();
        return $http.post(_url + "/changementpheromone/getnumchangement", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/changementpheromone/createweb", data);
      },
      getNumChangementMultipiege: function(data) {
        NProgress.start();
        return $http.post(_url + "/changementpheromone/getNumChangementMultipiege", data);
      }
    };
  });