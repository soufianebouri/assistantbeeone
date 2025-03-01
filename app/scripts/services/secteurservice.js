'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.SecteurService
 * @description
 * # SecteurService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('SecteurService', function ($http, _url) {
      return {
        get_all: function() {
          return $http.post(_url + "/secteur/get_all");
        },
        add: function(data) {
          return $http.post(_url + "/secteur/add", data);
        },
        edit: function(data) {
          return $http.post(_url + "/secteur/edit", data);
        },
        delete: function(data) {
          return $http.post(_url + "/secteur/delete", data);
        },
        multidelete: function(data) {
          return $http.post(_url + "/secteur/multidelete", data);
        },
        multiadd: function(data) {
          return $http.post(_url + "/secteur/multiadd", data);
        }
    };
  });
