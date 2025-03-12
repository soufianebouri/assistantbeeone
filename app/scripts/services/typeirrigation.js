'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.typeirrigation
 * @description
 * # typeirrigation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('typeirrigation', function ($http, _url) {
    return {
      get_all: function() {
        NProgress.start();
        return $http.post(_url + "/typeirrigation/get_all");
      }
    };
  });
