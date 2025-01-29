'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.sousparcelle
 * @description
 * # sousparcelle
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('sousparcelle', function($http, _url) {
    return {
      byparcellephysique: function(data) {
        NProgress.start();
        return $http.post(_url + "/sousparcelle/byparcellephysique", data);
      },
      byferme: function(data) {
        NProgress.start();
        return $http.post(_url + "/sousparcelle/byferme", data);
      }
    };
  });