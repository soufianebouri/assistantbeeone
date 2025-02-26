'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.portGreffe
 * @description
 * # portGreffe
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('portGreffe', function($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/porte_greffe/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/porte_greffe/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/porte_greffe/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/porte_greffe/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/porte_greffe/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/porte_greffe/multiadd", data);
      },
      getbyferme: function(data) {
        return $http.post(_url + "/porte_greffe/getbyferme", data);
      }
    };
  });
