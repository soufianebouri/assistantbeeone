'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.uniteoperation
 * @description
 * # uniteoperation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('uniteoperation', function($http, _url, $translatePartialLoader, $translate,$window) {
    return {
      get_all: function() {
        return $http.post(_url + "/unite/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/unite/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/unite/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/unite/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/unite/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/unite/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/unite/getbyferme", data);
      }
    };
  });
