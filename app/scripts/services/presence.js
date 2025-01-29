'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.presence
 * @description
 * # presence
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('presence', function($http, _url) {
    return {
      getPresence: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_presence/filtre", data);
      }
    };
  });