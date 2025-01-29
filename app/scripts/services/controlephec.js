'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.controlephec
 * @description
 * # controlephec
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('controlephec', function($http, _url) {
    return {
      getSomeProps: function(d) {
        NProgress.start();
        return $http.post(_url + "/controlephec/getsomeprops", d);
      },
      delete: function(d) {
        NProgress.start();
        return $http.post(_url + "/controlephec/delete", d);
      },
      update: function(d) {
        NProgress.start();
        return $http.post(_url + "/controlephec/update", d);
      },
      createweb: function(d) {
        NProgress.start();
        return $http.post(_url + "/controlephec/createweb", d);
      },
      getForGraphe: function(d) {
        NProgress.start();
        return $http.post(_url + "/controlephec/getForGraphe", d);
      }
    };
  });