'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.composantesRendement
 * @description
 * # composantesRendement
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('composantesRendement', function($http, _url) {
    return {
      get_composantes_rendement: function(d) {
        NProgress.start();
        return $http.post(_url + "/composantes_rendement/get_composantes_rendement", d);
      },
      get_composantes_rendement_byid: function(d) {
        NProgress.start();
        return $http.post(_url + "/composantes_rendement/get_composantes_rendement_byid", d);
      },
      get_composantes_rendement_element_byid: function(d) {
        NProgress.start();
        return $http.post(_url + "/composantes_rendement/get_composantes_rendement_element_byid", d);
      },
      delete: function(d) {
        NProgress.start();
        return $http.post(_url + "/composantes_rendement/delete", d);
      },
    };
  });