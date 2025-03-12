'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ModeApplication
 * @description
 * # ModeApplication
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ModeApplication', function($http, _url) {
    return {
      get_all: function() {
        NProgress.start();
        return $http.post(_url + "/modeapplication/get_all");
      }
    };
  });
