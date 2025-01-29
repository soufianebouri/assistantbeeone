'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.groupeculturaloperationnel
 * @description
 * # groupeculturaloperationnel
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('groupeculturaloperationnel', function($http, _url) {
    return {
      byvariete: function(data) {
        NProgress.start();
        return $http.post(_url + "/groupeculturaloperationnel/byferme", data);
      }
    };
  });