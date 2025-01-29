'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.comptagedespiegesmap
 * @description
 * # comptagedespiegesmap
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('comptagedespiegesmap', function($http, _url) {
    return {
      getInsectsByCible: function(data) {
        NProgress.start();
        return $http.post(_url + "/santeplante_comptagedespiegemap/getinsectsbycible", data);
      }
    };
  });