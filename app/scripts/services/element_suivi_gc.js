'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.elementSuiviGc
 * @description
 * # elementSuiviGc
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('elementSuiviGc', function($http, _url) {
    return {
      getall: function(data) {
        NProgress.start();
        return $http.post(_url + "/element_suivi_gc/getall", data);
      },
    };
  });