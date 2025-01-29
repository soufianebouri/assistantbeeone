'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.gestionterminaux
 * @description
 * # gestionterminaux
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('gestionterminaux', function ($http, _url ) {
    return {
      getAll: function() {
        return $http.get(_url + "/terminaux/getall");
      }
    };
  });
