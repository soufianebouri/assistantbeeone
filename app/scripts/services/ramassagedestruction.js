'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.RamassageDestruction
 * @description
 * # RamassageDestruction
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('RamassageDestruction', function($http, _url) {
    return {
      getRamassage: function(d) {
        NProgress.start();
        return $http.post(_url + "/ramassage/getSomeParams", d);
      },
      getRamassageFiche: function(d) {
        NProgress.start();
        return $http.post(_url + "/ramassage/getfiche", d);
      },
      delete: function(d) {
        NProgress.start();
        return $http.post(_url + "/ramassage/delete", d);
      },
      update: function(d) {
        NProgress.start();
        return $http.post(_url + "/ramassage/update", d);
      }
    };
  });