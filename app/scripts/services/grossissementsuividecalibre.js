'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.grossissementsuividecalibre
 * @description
 * # grossissementsuividecalibre
 * Service in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('grossissementsuividecalibre', function($http, _url) {
    return {
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/grossissementsuividecalibre/filtre", data);
      },
      getForGraphe: function(data) {
        NProgress.start();
        return $http.post(_url + "/grossissementsuividecalibre/getforgraphe", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/grossissementsuividecalibre/createweb", data);
      },
      getGrossissementByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/grossissementsuividecalibre/getGrossissementByID", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/grossissementsuividecalibre/updateweb", data);
      },
      deleteweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/grossissementsuividecalibre/deleteweb", data);
      }
    };
  });