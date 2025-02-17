'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ferme
 * @description
 * # ferme
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ferme', function ($http, _url) {
    return {
      get_all: function() {
        return $http.post(_url + "/ferme/get_all");
      },
      add: function(data) {
        return $http.post(_url + "/ferme/add", data);
      },
      edit: function(data) {
        return $http.post(_url + "/ferme/edit", data);
      },
      delete: function(data) {
        return $http.post(_url + "/ferme/delete", data);
      },
      multidelete: function(data) {
        return $http.post(_url + "/ferme/multidelete", data);
      },
      multiadd: function(data) {
        return $http.post(_url + "/ferme/multiadd", data);
      }
    };
  });
