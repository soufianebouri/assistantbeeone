'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.TypeVarieteService
 * @description
 * # TypeVarieteService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('TypeVarieteService', function($http, _url) {
    return {
      pushDataTypeVariete: function(baseUrl, data) {
        return $http.post(baseUrl + "/typeVariete/create", data);
      },
      getTypeVariete: function(baseUrl) {
        return $http.get(baseUrl + "/typeVariete/show");
      },
      getTypeVarieteByFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/typeVariete/getTypeVarieteByFerme", data);
      },
      deleteTypeVariete: function(baseUrl, data) {
        return $http.post(baseUrl + "/typeVariete/delete", data);
      },
      updateDataTypeVariete: function(baseUrl, data) {
        return $http.post(baseUrl + "/typeVariete/update", data);
      },
      showBySociete: function(data) {
        return $http.post(_url + "/typeVariete/showBySociete", data);
      },
      VarietesFarmBySociete: function(data) {
        return $http.post(_url + "/typeVariete/VarietesFarmBySociete", data);
      },
    };
  });