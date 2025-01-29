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
      getPortGreffe: function() {
        return $http.get(_url + "/porte_greffe");
      },
      getPortGreffeByFerme: function(idFerme) {
        return $http.get(_url + "/porte_greffe/byfarm/"+idFerme);
      }      
    };
  });
