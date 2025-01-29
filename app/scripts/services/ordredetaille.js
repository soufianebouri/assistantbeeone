'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ordredetaille
 * @description
 * # ordredetaille
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ordredetaille', function($http, _url) {
    return {
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordre_taille/getbyfiltre", data);
      },
      getparcellebyID: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordre_taille/getparcellebyID", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordre_taille/createweb", data);
      },
      deleteweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordre_taille/deleteweb", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordre_taille/updateweb", data);
      },
      getForSynthese: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordre_taille/getForSynthese", data);
      }
    };
  });