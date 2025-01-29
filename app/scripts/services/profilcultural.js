'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.profilcultural
 * @description
 * # profilcultural
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('profilcultural', function($http, _url) {
    return {
      byvariete: function(data) {
        NProgress.start();
        return $http.post(_url + "/profilcultural/byvariete", data);
      }
    };
  });