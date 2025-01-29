'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.elementcomptage
 * @description
 * # elementcomptage
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('elementcomptage', function($http, _url) {
    return {
      GetElementComptage: function() {
        NProgress.start();
        return $http.get(_url + "/get_elementcomptage/");
      }
    };
  });