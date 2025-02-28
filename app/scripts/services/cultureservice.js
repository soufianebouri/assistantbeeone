'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.cultureService
 * @description
 * # cultureService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('cultureService', function($http, Upload, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/culture/get_all");
      },
      get_byfermes: function(data) {
          return $http.post(_url + "/culture/get_byfermes", data);
      },
      add: function(data) {
        return $http.post(_url + "/culture/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/culture/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/culture/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/culture/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/culture/multiadd", data);
      },
    };
  });
