'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.groupeOperation
 * @description
 * # groupeOperation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('groupeOperation', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/groupe_operation/get_all");
      }
    };
  });
