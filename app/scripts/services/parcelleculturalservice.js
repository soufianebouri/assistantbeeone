'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.parcelleCulturalService
 * @description
 * # parcelleCulturalService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('parcelleCulturalService', function (_url, $http) {
    return {
      get_all: function() {
        return $http.post(_url + "/parcelleculturale/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/parcelleculturale/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/parcelleculturale/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/parcelleculturale/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/parcelleculturale/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/parcelleculturale/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/parcelleculturale/getbyferme", data);
      }
    };
  });
