'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.consultationparouvrier
 * @description
 * # consultationparouvrier
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('consultationparouvrier', function($http, _url) {
    return {
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_consultationparouvrier/filtre", data);
      }
    };
  });