'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.comptagedesravageurmap
 * @description
 * # comptagedesravageurmap
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('comptagedesravageurmap', function($http, _url) {
    return {
      getAVGinsectsByCible: function(data) {
        NProgress.start();
        return $http.post(_url + "/santeplante_comptagedesravageurmap/getavginsectsbycible", data);
      }
    };
  });